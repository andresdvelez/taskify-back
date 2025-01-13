import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProjectsService {
  constructor(@Inject('PROJECTS_CLIENT') private booksClient: ClientProxy) {}

  create(createProjectDto: CreateProjectDto) {
    return this.booksClient.send('projects.create', createProjectDto);
  }

  findAll() {
    return this.booksClient.send('projects.findAll', {});
  }

  findOne(id: number) {
    return this.booksClient.send('projects.findOne', id);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.booksClient.send('projects.update', { id, updateProjectDto });
  }

  remove(id: number) {
    return this.booksClient.send('projects.remove', id);
  }
}
