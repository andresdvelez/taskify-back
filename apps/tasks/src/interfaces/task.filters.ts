import { TaskPriority, TaskStatus } from './task.interface';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  search?: string;
  deadlineStart?: Date;
  deadlineEnd?: Date;
  assignedTo?: string[];
  createdBy?: string;
}
