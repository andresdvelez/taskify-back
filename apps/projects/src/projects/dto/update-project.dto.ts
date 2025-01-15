import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ProjectStatus } from './project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  id: string;
  name: string;
  status: ProjectStatus;
}
