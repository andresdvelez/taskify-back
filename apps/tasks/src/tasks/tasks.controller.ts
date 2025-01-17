import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RemoveCommentDto } from './dto/remove-comment.dto';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('tasks.create')
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern('tasks.findAll')
  findAll() {
    return this.tasksService.findAll();
  }

  @MessagePattern('tasks.getByIds')
  getByIds(@Payload() ids: string[]) {
    return this.tasksService.getByIds(ids);
  }

  @MessagePattern('tasks.findOne')
  findOne(@Payload() id: string) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern('tasks.update')
  update(@Payload() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto.id, updateTaskDto);
  }

  @MessagePattern('tasks.remove')
  remove(@Payload() id: string) {
    return this.tasksService.remove(id);
  }

  @MessagePattern('tasks.addComment')
  addCommentToTask(@Payload() createCommentDto: CreateCommentDto) {
    return this.tasksService.addCommentToTask(createCommentDto);
  }

  @MessagePattern('tasks.removeComment')
  removeCommentFromTask(@Payload() removeCommentDto: RemoveCommentDto) {
    return this.tasksService.removeCommentFromTask(removeCommentDto);
  }
}
