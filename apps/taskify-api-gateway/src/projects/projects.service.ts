import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  UpdateProjectDto,
  UpdateProjectStatusDto,
} from './dto/update-project.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AddTaskDto } from './dto/add-task.dto';
import { AssignMemberDto } from './dto/assign-member.dto';
import { FindByIdsDto } from './dto/find-by-ids.dto';

@Injectable()
export class ProjectsService {
  constructor(@Inject('PROJECTS_CLIENT') private projectsClient: ClientProxy) {}

  create(createProjectDto: CreateProjectDto) {
    return this.projectsClient.send('projects.create', createProjectDto);
  }

  findAll() {
    return this.projectsClient.send('projects.findAll', {});
  }

  findByIds(findByIdsDto: FindByIdsDto) {
    return this.projectsClient.send('projects.findByIds', {
      ids: findByIdsDto.ids,
    });
  }

  findTeam() {
    return this.projectsClient.send('projects.findTeam', {});
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

  updateStatus(updateProjectStatusDto: UpdateProjectStatusDto) {
    return this.projectsClient.send('projects.updateStatus', {
      updateProjectStatusDto,
    });
  }

  remove(id: string) {
    return this.projectsClient.send('projects.remove', id);
  }

  addTask(addTaskDto: AddTaskDto) {
    return this.projectsClient.send('projects.addTask', addTaskDto);
  }

  assignMember(assignMemberDto: AssignMemberDto, id: string) {
    return this.projectsClient.send('projects.assignMember', {
      userId: assignMemberDto.userId,
      projectId: id,
    });
  }
}
