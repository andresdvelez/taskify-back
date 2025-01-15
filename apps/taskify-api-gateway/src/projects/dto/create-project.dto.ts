import { ProjectStatus } from '@projects/projects/dto/project.dto';

export class CreateProjectDto {
  name: string;

  description: string;

  status?: ProjectStatus;
}
