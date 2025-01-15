import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './database/db.config';

@Module({
  imports: [TasksModule, ConfigModule.forRoot({ load: [dbConfig] })],
  controllers: [],
  providers: [],
})
export class TasksAppModule {}
