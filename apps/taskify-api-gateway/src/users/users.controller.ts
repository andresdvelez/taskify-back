import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OtpService } from './services/otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { InviteMemberDto } from './dto/invite-member.dto';
import { SignUpWithTokenDto } from './interfaces/sign-up-with-token';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  @Post('/sign-in')
  signIn(@Body() signInDto: SignInDto) {
    const user = this.usersService.signIn(signInDto);
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('invite')
  inviteMember(@Body() inviteMemberDto: InviteMemberDto) {
    return this.usersService.inviteMember(inviteMemberDto);
  }

  @Post('sign-up-token')
  signUpWithToken(@Body() signUpDto: SignUpWithTokenDto) {
    return this.usersService.signUpWithToken(signUpDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('get-team')
  @UseGuards(JwtAuthGuard)
  findTeam() {
    return this.usersService.findTeam();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('/otp')
  otpSend(@Body() email: string) {
    return this.otpService.otpSend(email);
  }

  @Post('/otp/verify')
  otpVerify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.otpVerify(verifyOtpDto);
  }

  @Post('assign-project')
  assignProject(@Body() data: { projectId: string; userId: string }) {
    return this.usersService.assignProject(data);
  }

  @Post('notify-user')
  notifyUser(@Body() data: { message: string; userIds: string[] }) {
    return this.usersService.notifyUser(data);
  }

  @Delete('delete-notification/:id/:userId')
  deleteNotification(@Param() id: string, userId: string) {
    return this.usersService.deleteNotification({ id, userId });
  }

  @Get('get-notifications/:id')
  @UseGuards(JwtAuthGuard)
  getNotifications(@Param() id: string) {
    return this.usersService.getNotifications(id);
  }
}
