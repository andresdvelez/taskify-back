import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly userRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch {
      throw new BadRequestException('Error verifying password');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });
    } catch {
      throw new BadRequestException('Error hashing password');
    }
  }

  private async findOneWithPassword(id: string): Promise<Users> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async signIn(signInDto: SignInDto) {
    try {
      const existingUser = await this.userRepo.findOneBy({
        email: signInDto.email,
      });

      if (!existingUser) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const isPasswordValid = await this.verifyPassword(
        signInDto.password,
        existingUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = existingUser;

      const payload = {
        sub: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      return {
        ...userWithoutPassword,
        authToken: accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Error signing in');
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await this.hashPassword(createUserDto.password);

      const user = this.userRepo.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepo.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error creating user');
    }
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.findOneWithPassword(id);

      const isPasswordValid = await this.verifyPassword(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedNewPassword = await this.hashPassword(newPassword);
      user.password = hashedNewPassword;

      await this.userRepo.save(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Error updating password');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find();
      if (!users.length) {
        throw new NotFoundException('No users found');
      }
      return users.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.findOneWithPassword(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOneWithPassword(id);

      if (updateUserDto.email) {
        const existingUser = await this.userRepo.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Email is already in use');
        }
      }

      const updatedUser = Object.assign(user, updateUserDto);
      const savedUser = await this.userRepo.save(updatedUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Error updating user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOneWithPassword(id);
      await this.userRepo.remove(user);
      return { message: 'User successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting user');
    }
  }
}
