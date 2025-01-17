import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  UpdateProjectDto,
  UpdateProjectStatusDto,
} from './dto/update-project.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AddTaskDto } from './dto/add-task.dto';
import { AssignMemberDto } from './dto/assign-member.dto';
import { FindByIdsDto } from './dto/find-by-ids.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.projectsService.findAll();
  }

  @Post('projects-by-ids')
  @UseGuards(JwtAuthGuard)
  findByIds(@Body() findByIdsDto: FindByIdsDto) {
    return this.projectsService.findByIds(findByIdsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch('/update-status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Body() updateProjectStatusDto: UpdateProjectStatusDto) {
    return this.projectsService.updateStatus(updateProjectStatusDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post('add-task')
  addTask(@Body() addTaskDto: AddTaskDto) {
    return this.projectsService.addTask(addTaskDto);
  }

  @Patch('assign/:id')
  assignMember(@Body() assignMemberDto: AssignMemberDto, @Param() id: string) {
    return this.projectsService.assignMember(assignMemberDto, id);
  }
}
