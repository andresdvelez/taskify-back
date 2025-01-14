import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OtpService } from './services/otp.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@taskify/users/strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: 'USERS_CLIENT',
        transport: Transport.TCP,
        options: { port: 4001 },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, OtpService, LocalStrategy, JwtStrategy],
})
export class UsersModule {}
