import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly userRepo: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);

    const userCreate = await this.userRepo.create(createUserDto);

    console.log(userCreate);

    const superAdmin = this.userRepo.create(createUserDto);

    console.log(superAdmin);
    return this.userRepo.save(superAdmin);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
