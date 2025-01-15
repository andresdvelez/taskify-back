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

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_REPOSITORY')
    private readonly taskRepo: Repository<Tasks>,
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

  async findByIds(ids: string[]): Promise<Tasks[]> {
    return await this.taskRepo.find({
      where: { id: In(ids) },
    });
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
}
