import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './database/db.config';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({ load: [dbConfig] })],
  controllers: [],
  providers: [],
})
export class UsersAppModule {}
