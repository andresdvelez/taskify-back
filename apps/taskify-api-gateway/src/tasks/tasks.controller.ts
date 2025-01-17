import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RemoveCommentDto } from './dto/remove-comment.dto';
import { FindTasksDto } from './dto/find-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() findTasksDto: FindTasksDto) {
    return this.tasksService.findAll(findTasksDto);
  }

  @Post('get-by-ids')
  getByIds(@Body() data: { tasksIds: string[] }) {
    const { tasksIds } = data;
    return this.tasksService.getByIds(tasksIds);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post('add-comment')
  addCommentToTask(@Body() createCommentDto: CreateCommentDto) {
    return this.tasksService.addCommentToTask(createCommentDto);
  }

  @Post('remove-comment')
  removeCommentFromTask(@Body() removeCommentDto: RemoveCommentDto) {
    return this.tasksService.removeCommentFromTask(removeCommentDto);
  }
}
