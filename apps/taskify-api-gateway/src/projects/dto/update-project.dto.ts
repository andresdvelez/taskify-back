import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ProjectStatus } from '@projects/projects/dto/project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class UpdateProjectStatusDto extends PartialType(CreateProjectDto) {
  id: string;
  status: ProjectStatus;
}
