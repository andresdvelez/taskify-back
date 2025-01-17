import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository, In } from 'typeorm';
import { Tasks } from '../entities/task.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TaskComment } from '../interfaces/task.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RemoveCommentDto } from './dto/remove-comment.dto';

@Injectable()
export class TasksService {
  private readonly gatewayUrl: string = 'http://localhost:3001';

  constructor(
    @Inject('TASKS_REPOSITORY')
    private readonly taskRepo: Repository<Tasks>,
    private readonly httpService: HttpService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Tasks> {
    try {
      const existingTask = await this.taskRepo.findOne({
        where: { title: createTaskDto.title },
      });

      if (existingTask) {
        throw new ConflictException('Task with this id already exists');
      }

      const task = this.taskRepo.create(createTaskDto);

      await this.taskRepo.save(task);

      if (createTaskDto.projectId) {
        try {
          await lastValueFrom(
            this.httpService.post(`${this.gatewayUrl}/projects/add-task`, {
              projectId: createTaskDto.projectId,
              taskId: task.id,
            }),
          );
        } catch {
          await this.taskRepo.remove(task);
          throw new BadRequestException('Error updating project with new task');
        }
      }

      return task;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error creating task');
    }
  }

  async findAll(): Promise<Tasks[]> {
    return await this.taskRepo.find();
  }

  async findOne(id: string): Promise<Tasks> {
    const task = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async getByIds(ids: string[]): Promise<Tasks[]> {
    try {
      return await this.taskRepo.find({
        order: {
          createdAt: 'ASC',
        },
        where: { id: In(ids) },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching tasks');
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Tasks> {
    const task = await this.findOne(id);

    // Merge the updateTaskDto with the existing task
    Object.assign(task, updateTaskDto);

    return await this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async addCommentToTask(createCommentDto: CreateCommentDto) {
    try {
      const task = await this.findOne(createCommentDto.taskId);

      if (!task.comments) {
        task.comments = [];
      }

      const newComment: TaskComment = {
        message: createCommentDto.message,
        authorId: createCommentDto.authorId,
        id: `${task.comments.length + 1}-${task.id}`,
        timestamp: new Date(),
      };

      task.comments.push(newComment);
      task.updatedAt = new Date();

      // Notify project assignees
      await lastValueFrom(
        this.httpService.post(`${this.gatewayUrl}/users/notify-user`, {
          userIds: [task.createdBy],
          message: `Your task ${task.title} has a new comment`,
        }),
      );

      await this.taskRepo.save(task);
      return newComment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error adding comment to task');
    }
  }

  async removeCommentFromTask(removeCommentDto: RemoveCommentDto) {
    try {
      const task = await this.findOne(removeCommentDto.taskId);

      if (!task.comments) {
        throw new NotFoundException('No comments found for this task');
      }

      const commentIndex = task.comments.findIndex(
        (comment) => comment.id === removeCommentDto.commentId,
      );

      if (!commentIndex) {
        throw new NotFoundException(
          `Comment with ID ${removeCommentDto.commentId} not found`,
        );
      }

      task.comments.splice(commentIndex, 1);
      task.updatedAt = new Date();

      await this.taskRepo.save(task);

      return removeCommentDto.taskId;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error removing comment from task');
    }
  }
}
