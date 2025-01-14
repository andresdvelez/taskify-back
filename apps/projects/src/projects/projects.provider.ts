import { DataSource } from 'typeorm';
import { Project } from './entities/project.entity';

export const projectsProvider = [
  {
    provide: 'PROJECTS_REPOSITORY',
    useFactory: async (dataSource: DataSource) => {
      return dataSource.getRepository(Project);
    },
    inject: ['DATA_SOURCE'],
  },
];
