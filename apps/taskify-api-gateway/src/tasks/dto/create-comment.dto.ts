export interface TaskComment {
  id: number;
  authorId: string;
  message: string;
  timestamp: Date;
}

export class CreateCommentDto {
  taskId: string;
  comment: TaskComment;
}
