import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './database/db.config';

@Module({
  imports: [ProjectsModule, ConfigModule.forRoot({ load: [dbConfig] })],
  controllers: [],
  providers: [],
})
export class ProjectsAppModule {}
