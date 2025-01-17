import { TaskPriority, TaskStatus } from '../../interfaces/task.interface';

export class FindTasksDto {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  search?: string;
  deadlineStart?: string;
  deadlineEnd?: string;
  assignedTo?: string[];
  createdBy?: string;
}
