import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './services/users.service';
import { OtpService } from './services/otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { SignUpWithTokenDto } from './interfaces/sign-up-with-token';

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

  @MessagePattern('users.inviteMember')
  inviteMember(@Payload() inviteMemberDto: InviteMemberDto) {
    return this.usersService.inviteMember(inviteMemberDto);
  }

  @MessagePattern('users.signUpWithToken')
  signUpWithToken(@Payload() signUpDto: SignUpWithTokenDto) {
    return this.usersService.signUpWithToken(signUpDto);
  }

  @MessagePattern('users.findAll')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('users.findTeam')
  findTeam() {
    return this.usersService.findTeam();
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

  @MessagePattern('users.assignProject')
  assignProject(
    @Payload() assignProjectDto: { projectId: string; userId: string },
  ) {
    return this.usersService.assignProject({
      projectId: assignProjectDto.projectId,
      userId: assignProjectDto.userId,
    });
  }

  @MessagePattern('users.notifyUser')
  notifyUser(@Payload() notifyUserDto: { message: string; userIds: string[] }) {
    return this.usersService.notifyUser({
      message: notifyUserDto.message,
      userIds: notifyUserDto.userIds,
    });
  }

  @MessagePattern('users.deleteNotification')
  deleteNotification(
    @Payload() deleteNotificationDto: { id: { id: string; userId: string } },
  ) {
    return this.usersService.deleteNotification(deleteNotificationDto);
  }

  @MessagePattern('users.getNotifications')
  getNotifications(@Payload() getNotificationsDto: { id: string }) {
    return this.usersService.getNotifications(getNotificationsDto);
  }
}
