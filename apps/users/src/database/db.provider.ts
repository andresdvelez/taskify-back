import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const database = configService.get('database');
      const dataSource = new DataSource(database);

      return await dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
