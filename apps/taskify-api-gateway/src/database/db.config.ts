import { Users } from '@users/users/entities/user.entity';
import { Project } from 'apps/projects/src/projects/entities/project.entity';

export const dbConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  resend: process.env.RESEND,
  database: {
    type: 'postgres',
    host: process.env.DATA_BASE_HOST,
    port: parseInt(process.env.DATA_BASE_PORT, 10) || 5432,
    username: process.env.DATA_BASE_USERNAME,
    password: process.env.DATA_BASE_HOST_PASSWORD,
    database: process.env.DATA_BASE_NAME,
    entities: [Users, Project],
    synchronize: false,
  },
});
