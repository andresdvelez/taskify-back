export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TaskComment {
  id: string;
  authorId: string;
  message: string;
  timestamp: Date;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string[];
  deadline: Date | string;
  createdBy: string;
  projectId: string;
  comments: TaskComment[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
