export class TaskComment {
  id: string;
  authorId: string;
  message: string;
  timestamp: Date;
}

export class CreateCommentDto extends TaskComment {
  taskId: string;
}
