import { DataSource } from 'typeorm';
import { Tasks } from '../entities/task.entity';

export const tasksProvider = [
  {
    provide: 'TASKS_REPOSITORY',
    useFactory: async (dataSource: DataSource) => {
      return dataSource.getRepository(Tasks);
    },
    inject: ['DATA_SOURCE'],
  },
];
