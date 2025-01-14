import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { UtilEmail } from '../utils/send-email';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly userRepo: Repository<Users>,
    private readonly sendEmail: UtilEmail,
    private jwtService: JwtService,
  ) {}

  async otpSend({ email }: { email: string }) {
    try {
      console.log('test');

      const existingUser = await this.userRepo.findOneBy({
        email,
      });

      if (!existingUser) {
        throw new HttpException('email-not-exists', HttpStatus.NOT_FOUND);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      existingUser.otp = code;
      existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await this.userRepo.save(existingUser);

      await this.sendEmail.send(
        'Here is your verification code',
        email,
        code,
        'Verification Code',
      );

      return { message: ' Verification email sent' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el usuario');
    }
  }

  async verifyOtp({ email, otp }: VerifyOtpDto) {
    try {
      const user = await this.userRepo.findOneBy({
        email,
      });

      if (!user) {
        throw new HttpException('email-not-exists', HttpStatus.NOT_FOUND);
      }

      if (!user.otp || !user.otpExpiry) {
        throw new BadRequestException('No OTP was generated for this user');
      }

      if (new Date() > user.otpExpiry) {
        user.otp = null;
        user.otpExpiry = null;
        await this.userRepo.save(user);
        throw new BadRequestException('OTP has expired');
      }

      if (user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUser } = user;

      const userToken = this.jwtService.sign(restUser);

      user.otp = null;
      user.otpExpiry = null;
      await this.userRepo.save(user);

      return { ...restUser, authToken: userToken };
    } catch (error) {
      console.log(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Error al verificar el código');
    }
  }
}
