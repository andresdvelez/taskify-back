import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { usersProvider } from './users.provider';
import { DBModule } from '@users/database/db.module';
import { UsersService } from './services/users.service';
import { OtpService } from './services/otp.service';
import { UtilEmail } from './utils/send-email';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DBModule,
    ConfigModule,
    JwtModule.register({
      secret: 'ABC123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, OtpService, UtilEmail, ...usersProvider],
})
export class UsersModule {}
