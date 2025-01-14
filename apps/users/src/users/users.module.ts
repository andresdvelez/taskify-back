import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { usersProvider } from './users.provider';
import { DBModule } from '@users/database/db.module';
import { UsersService } from './services/users.service';
import { OtpService } from './services/otp.service';
import { UtilEmail } from './utils/send-email';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DBModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, OtpService, UtilEmail, ...usersProvider],
  exports: [UsersService],
})
export class UsersModule {}
