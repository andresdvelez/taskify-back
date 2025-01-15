import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  constructor(@Inject('TASKS_CLIENT') private tasksClient: ClientProxy) {}

  create(createTaskDto: CreateTaskDto) {
    return this.tasksClient.send('tasks.create', createTaskDto);
  }

  findAll() {
    return this.tasksClient.send('tasks.findAll', {});
  }

  findOne(id: number) {
    return this.tasksClient.send('tasks.findOne', id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.tasksClient.send('tasks.update', { id, ...updateTaskDto });
  }

  remove(id: number) {
    return this.tasksClient.send('tasks.remove', id);
  }
}
