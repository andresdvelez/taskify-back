import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindByIdsDto } from '@taskify/projects/dto/find-by-ids.dto';
import { UpdateProjectStatusDto } from '@taskify/projects/dto/update-project.dto';

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

  @MessagePattern('projects.findByIds')
  findByIds(@Payload() findByIdsDto: FindByIdsDto) {
    return this.projectsService.findByIds(findByIdsDto.ids);
  }

  @MessagePattern('projects.findOne')
  findOne(@Payload() id: string) {
    return this.projectsService.findOne(id);
  }

  @MessagePattern('projects.update')
  update(@Payload() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(updateProjectDto.id, updateProjectDto);
  }

  @MessagePattern('projects.updateStatus')
  updateStatus(@Payload() updateProjectStatusDto: UpdateProjectStatusDto) {
    return this.projectsService.updateProjectStatus(updateProjectStatusDto);
  }

  @MessagePattern('projects.remove')
  remove(@Payload() id: string) {
    return this.projectsService.remove(id);
  }

  @MessagePattern('projects.addTask')
  async addTaskToProject(
    @Payload() data: { projectId: string; taskId: string },
  ) {
    return this.projectsService.addTaskToProject(data.projectId, data.taskId);
  }

  @MessagePattern('projects.removeTask')
  async removeTaskFromProject(
    @Payload() data: { projectId: string; taskId: string },
  ) {
    return this.projectsService.removeTaskFromProject(
      data.projectId,
      data.taskId,
    );
  }

  @MessagePattern('projects.assignMember')
  async assignMember(
    @Payload() data: { projectId: { id: string }; userId: string },
  ) {
    return this.projectsService.assignMember(data.projectId, data.userId);
  }
}
