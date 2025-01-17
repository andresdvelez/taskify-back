import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { In, Repository } from 'typeorm';
import { ProjectStatus } from './dto/project.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProjectsService {
  private readonly gatewayUrl: string = 'http://localhost:3001';

  constructor(
    @Inject('PROJECTS_REPOSITORY')
    private readonly projectRepo: Repository<Project>,
    private readonly httpService: HttpService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const existingProject = await this.projectRepo.findOne({
        where: { name: createProjectDto.name },
      });

      if (existingProject) {
        throw new ConflictException('A project with this name already exists');
      }

      const project = this.projectRepo.create({
        ...createProjectDto,
        status: ProjectStatus.ACTIVE,
        tasks: [],
        assignees: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Notify project creator
      await lastValueFrom(
        this.httpService.post(`${this.gatewayUrl}/users/notify-user`, {
          userIds: [createProjectDto.createdBy],
          message: `Project ${project.name} has been created successfully`,
        }),
      );

      return await this.projectRepo.save(project);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error creating project');
    }
  }

  async findAll() {
    try {
      const projects = await this.projectRepo.find({
        order: {
          createdAt: 'ASC',
        },
      });

      return projects;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching projects');
    }
  }

  async findByIds(ids: string[]) {
    try {
      const projects = await this.projectRepo.find({
        order: {
          createdAt: 'ASC',
        },
        where: { id: In(ids) },
      });

      return projects;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching projects');
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.projectRepo.findOne({
        where: { id },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching project');
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.findOne(id);

      if (updateProjectDto.name && updateProjectDto.name !== project.name) {
        const existingProject = await this.projectRepo.findOne({
          where: { name: updateProjectDto.name },
        });

        if (existingProject && existingProject.id !== id) {
          throw new ConflictException(
            'A project with this name already exists',
          );
        }
      }

      if (
        updateProjectDto.status &&
        !Object.values(ProjectStatus).includes(updateProjectDto.status)
      ) {
        throw new BadRequestException('Invalid project status');
      }

      const updatedProject = Object.assign(project, {
        ...updateProjectDto,
        updatedAt: new Date(),
      });

      return await this.projectRepo.save(updatedProject);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Error updating project');
    }
  }

  async remove(id: string) {
    try {
      const project = await this.findOne(id);

      await this.projectRepo.remove(project);
      return { message: 'Project successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting project');
    }
  }

  async updateProjectStatus(updateProjectStatusDto: {
    id: string;
    status: ProjectStatus;
  }) {
    try {
      const project = await this.findOne(updateProjectStatusDto.id);

      project.status = updateProjectStatusDto.status;
      project.updatedAt = new Date();

      // Notify project assignees
      await lastValueFrom(
        this.httpService.post(`${this.gatewayUrl}/users/notify-user`, {
          userIds: project.assignees,
          message: `The status of the project ${project.name} has been moved to ${updateProjectStatusDto.status}`,
        }),
      );

      const updatedProject = await this.projectRepo.save(project);
      return updatedProject;
    } catch {
      throw new BadRequestException('Error updating project status');
    }
  }

  async addTaskToProject(projectId: string, taskId: string) {
    try {
      const project = await this.findOne(projectId);

      if (!project.tasks) {
        project.tasks = [];
      }

      project.tasks.push(taskId);
      project.updatedAt = new Date();

      // Notify project assignees
      await lastValueFrom(
        this.httpService.post(`${this.gatewayUrl}/users/notify-user`, {
          userIds: project.assignees,
          message: `Task created for the project ${project.name}`,
        }),
      );

      return await this.projectRepo.save(project);
    } catch {
      throw new BadRequestException('Error adding task to project');
    }
  }

  async removeTaskFromProject(projectId: string, taskId: string) {
    try {
      const project = await this.findOne(projectId);

      project.tasks = project.tasks.filter((id) => id !== taskId);
      project.updatedAt = new Date();

      return await this.projectRepo.save(project);
    } catch {
      throw new BadRequestException('Error removing task from project');
    }
  }

  async assignMember(projectId: { id: string }, userId: string) {
    try {
      const project = await this.findOne(projectId.id);

      if (!project.assignees) {
        project.assignees = [];
      }

      if (project.assignees.includes(userId)) {
        throw new BadRequestException(
          'User is already assigned to this project',
        );
      }

      project.assignees.push(userId);
      project.updatedAt = new Date();

      // Notify project assignees
      await lastValueFrom(
        this.httpService.post(`${this.gatewayUrl}/users/notify-user`, {
          userIds: project.assignees,
          message: `A new member has been assigned for the project ${project.name}`,
        }),
      );

      if (userId) {
        try {
          await lastValueFrom(
            this.httpService.post(`${this.gatewayUrl}/users/assign-project`, {
              projectId: projectId.id,
              userId,
            }),
          );
        } catch {
          throw new BadRequestException('Error updating project with new task');
        }
      }

      return await this.projectRepo.save(project);
    } catch {
      throw new BadRequestException('Error adding member to project');
    }
  }
}
