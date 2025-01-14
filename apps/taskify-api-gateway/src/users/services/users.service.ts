import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private usersClient: ClientProxy) {}

  signIn(signInDto: SignInDto) {
    return this.usersClient.send('users.sign-in', signInDto);
  }

  create(createUserDto: CreateUserDto) {
    return this.usersClient.send('users.create', createUserDto);
  }

  findAll() {
    return this.usersClient.send('users.findAll', {});
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
}
