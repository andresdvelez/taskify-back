import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern('projects.create')
  create(@Payload() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @MessagePattern('projects.findAll')
  findAll() {
    return this.projectsService.findAll();
  }

  @MessagePattern('projects.findOne')
  findOne(@Payload() id: string) {
    return this.projectsService.findOne(id);
  }

  @MessagePattern('projects.update')
  update(@Payload() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(updateProjectDto.id, updateProjectDto);
  }

  @MessagePattern('projects.remove')
  remove(@Payload() id: string) {
    return this.projectsService.remove(id);
  }
}
