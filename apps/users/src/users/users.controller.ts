import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './services/users.service';
import { OtpService } from './services/otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  @MessagePattern('users.sign-in')
  signIn(@Payload() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @MessagePattern('users.create')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('users.findAll')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('users.findOne')
  findOne(@Payload() id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('users.update')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('users.remove')
  remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }

  @MessagePattern('otp.send')
  otpSend(@Payload() email: { email: string }) {
    return this.otpService.otpSend(email);
  }

  @MessagePattern('otp.verify')
  verifyOtp(@Payload() verifyEmailDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyEmailDto);
  }
}
