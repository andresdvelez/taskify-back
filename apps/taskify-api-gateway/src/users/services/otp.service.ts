import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Injectable()
export class OtpService {
  constructor(@Inject('USERS_CLIENT') private usersClient: ClientProxy) {}

  otpSend(email: string) {
    return this.usersClient.send('otp.send', email);
  }

  otpVerify(verifyOtpDto: VerifyOtpDto) {
    return this.usersClient.send('otp.verify', verifyOtpDto);
  }
}
