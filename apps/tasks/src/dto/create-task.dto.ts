import { TaskPriority, TaskStatus } from '../interfaces/task.interface';

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  assignedTo: string[];
  deadline: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string[];
  deadline?: Date;
}
