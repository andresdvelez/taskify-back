import { DataSource } from 'typeorm';
import { Users } from './entities/user.entity';

export const usersProvider = [
  {
    provide: 'USERS_REPOSITORY',
    useFactory: async (dataSource: DataSource) => {
      return dataSource.getRepository(Users);
    },
    inject: ['DATA_SOURCE'],
  },
];
