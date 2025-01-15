import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProjectsService {
  constructor(@Inject('PROJECTS_CLIENT') private projectsClient: ClientProxy) {}

  create(createProjectDto: CreateProjectDto) {
    return this.projectsClient.send('projects.create', createProjectDto);
  }

  findAll() {
    return this.projectsClient.send('projects.findAll', {});
  }

  findOne(id: string) {
    return this.projectsClient.send('projects.findOne', id);
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.projectsClient.send('projects.update', {
      id,
      updateProjectDto,
    });
  }

  remove(id: string) {
    return this.projectsClient.send('projects.remove', id);
  }
}
