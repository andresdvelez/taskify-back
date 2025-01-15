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
import { Repository } from 'typeorm';
import { ProjectStatus } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PROJECTS_REPOSITORY')
    private readonly projectRepo: Repository<Project>,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await this.projectRepo.save(project);
    } catch (error) {
      console.log(error);
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
          createdAt: 'DESC',
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

      // If name is being updated, check for duplicates
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

      // Check if project has active tasks
      if (project.tasks && project.tasks.length > 0) {
        throw new BadRequestException(
          'Cannot delete project with existing tasks',
        );
      }

      await this.projectRepo.remove(project);
      return { message: 'Project successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting project');
    }
  }

  // Additional helper methods
  async updateProjectStatus(id: string, status: ProjectStatus) {
    try {
      const project = await this.findOne(id);

      project.status = status;
      project.updatedAt = new Date();

      return await this.projectRepo.save(project);
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
}
