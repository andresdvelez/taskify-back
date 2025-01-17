import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from '../dto/sign-in.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { SignUpWithTokenDto } from '../interfaces/sign-up-with-token';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private usersClient: ClientProxy) {}

  signIn(signInDto: SignInDto) {
    return this.usersClient.send('users.sign-in', signInDto);
  }

  create(createUserDto: CreateUserDto) {
    return this.usersClient.send('users.create', createUserDto);
  }

  inviteMember(inviteMemberDto: InviteMemberDto) {
    return this.usersClient.send('users.inviteMember', inviteMemberDto);
  }

  signUpWithToken(signUpDto: SignUpWithTokenDto) {
    return this.usersClient.send('users.signUpWithToken', signUpDto);
  }

  findAll() {
    return this.usersClient.send('users.findAll', {});
  }

  findTeam() {
    return this.usersClient.send('users.findTeam', {});
  }

  findOne(id: number) {
    return this.usersClient.send('users.findOne', id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersClient.send('users.update', { id, ...updateUserDto });
  }

  remove(id: string) {
    return this.usersClient.send('users.remove', id);
  }

  assignProject(data: { projectId: string; userId: string }) {
    return this.usersClient.send('users.assignProject', data);
  }

  notifyUser(data: { message: string; userIds: string[] }) {
    return this.usersClient.send('users.notifyUser', data);
  }

  deleteNotification(deleteNotificationDto: { id: string; userId: string }) {
    return this.usersClient.send(
      'users.deleteNotification',
      deleteNotificationDto,
    );
  }

  getNotifications(id: string) {
    return this.usersClient.send('users.getNotifications', id);
  }
}
