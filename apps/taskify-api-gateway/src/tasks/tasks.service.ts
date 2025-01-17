import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RemoveCommentDto } from './dto/remove-comment.dto';
import { FindTasksDto } from './dto/find-tasks.dto';

@Injectable()
export class TasksService {
  constructor(@Inject('TASKS_CLIENT') private tasksClient: ClientProxy) {}

  create(createTaskDto: CreateTaskDto) {
    return this.tasksClient.send('tasks.create', createTaskDto);
  }

  findAll(findTasksDto: FindTasksDto) {
    return this.tasksClient.send('tasks.findAll', findTasksDto);
  }

  getByIds(ids: string[]) {
    return this.tasksClient.send('tasks.getByIds', ids);
  }

  findOne(id: number) {
    return this.tasksClient.send('tasks.findOne', id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.tasksClient.send('tasks.update', { id, ...updateTaskDto });
  }

  remove(id: string) {
    return this.tasksClient.send('tasks.remove', id);
  }

  addCommentToTask(createCommentDto: CreateCommentDto) {
    return this.tasksClient.send('tasks.addComment', createCommentDto);
  }

  removeCommentFromTask(removeCommentDto: RemoveCommentDto) {
    return this.tasksClient.send('tasks.removeComment', removeCommentDto);
  }
}
