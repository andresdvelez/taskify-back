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
import { UserRole } from '@users/dto/user.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UtilEmail } from '../utils/send-email';
import {
  SignUpWithTokenDto,
  TokenPayload,
} from '../interfaces/sign-up-with-token';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private readonly userRepo: Repository<Users>,
    private jwtService: JwtService,
    private readonly sendEmail: UtilEmail,
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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error creating user');
    }
  }

  async inviteMember(inviteMemberDto: InviteMemberDto) {
    try {
      const existingUser = await this.userRepo.findOne({
        where: { id: inviteMemberDto.ownerId },
      });

      const userToInvitate = await this.userRepo.findOne({
        where: { email: inviteMemberDto.email },
      });

      if (userToInvitate) {
        throw new ConflictException('User with this email already exists');
      }

      const invitationToken = this.jwtService.sign(
        {
          email: inviteMemberDto.email,
          invitedBy: existingUser.id,
          role: inviteMemberDto.role,
        },
        {
          expiresIn: '24h',
        },
      );

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Team Invitation</h2>
          <p>You have been invited to join ${existingUser.firstName} ${existingUser.lastName}'s team!</p>
          <div style="margin: 30px 0;">
            <a href="http://localhost:3000/${inviteMemberDto.locale}/sign-up?token=${invitationToken}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 14px 20px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      display: inline-block;">
              Accept Invitation & Sign Up
            </a>
          </div>
          <p>This invitation link will expire in 24 hours.</p>
          <p>If you did not expect this invitation, please ignore this email.</p>
        </div>
      `;

      await this.sendEmail.send(
        emailHtml,
        inviteMemberDto.email,
        `Invitation to join ${existingUser.firstName} ${existingUser.lastName}'s team`,
      );

      return { message: 'Invitation email sent successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error sending email');
    }
  }

  async signUpWithToken(signUpDto: SignUpWithTokenDto) {
    try {
      let tokenPayload: TokenPayload;
      try {
        tokenPayload = this.jwtService.verify(signUpDto.token) as TokenPayload;
      } catch {
        throw new UnauthorizedException('Invalid or expired invitation token');
      }

      const invitingUser = await this.userRepo.findOne({
        where: { id: tokenPayload.invitedBy },
      });

      if (!invitingUser) {
        throw new NotFoundException('Inviting user no longer exists');
      }

      const existingUser = await this.userRepo.findOne({
        where: { email: tokenPayload.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await this.hashPassword(signUpDto.password);

      const newUser = this.userRepo.create({
        email: tokenPayload.email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        password: hashedPassword,
        role: tokenPayload.role,
        projects: [],
      });

      const savedUser = await this.userRepo.save(newUser);

      const authPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      };

      const accessToken = this.jwtService.sign(authPayload, {
        expiresIn: '7d',
      });

      const refreshToken = this.jwtService.sign(authPayload, {
        expiresIn: '7d',
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;

      return {
        ...userWithoutPassword,
        authToken: accessToken,
        refreshToken,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Error during sign up process');
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
      const users = await this.userRepo.find({
        order: {
          createdAt: 'ASC',
        },
      });
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

  async findTeam() {
    try {
      const users = await this.userRepo.find({
        where: {
          role: UserRole.TEAM_MEMBER,
        },
        order: {
          createdAt: 'ASC',
        },
      });

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

  async assignProject({
    projectId,
    userId,
  }: {
    projectId: string;
    userId: string;
  }) {
    try {
      const user = await this.findOne(userId);

      if (!user.projects) {
        user.projects = [];
      }

      user.projects.push(projectId);

      return await this.userRepo.save(user);
    } catch {
      throw new BadRequestException('Error adding project to user');
    }
  }

  async notifyUser({
    message,
    userIds,
  }: {
    message: string;
    userIds: string[];
  }) {
    try {
      const notifications = [];

      for (const userId of userIds) {
        const user = await this.findOne(userId);

        if (!user.notifications) {
          user.notifications = [];
        }

        const notification = {
          id: `${user.notifications.length + 1}-${user.id}`,
          message,
          createdAt: new Date(),
        };

        user.notifications.push(notification);
        await this.userRepo.save(user);
        notifications.push({ userId, notification });
      }

      return { message: 'Notifications sent successfully', notifications };
    } catch {
      throw new BadRequestException('Error sending notification to user');
    }
  }

  async deleteNotification(deleteNotificationDto: {
    id: {
      userId: string;
      id: string;
    };
  }) {
    try {
      const user = await this.findOne(deleteNotificationDto.id.userId);

      if (!user.notifications) {
        throw new NotFoundException('No notifications found for this user');
      }

      const notificationExists = user.notifications.some(
        (notification) => notification.id === deleteNotificationDto.id.id,
      );

      if (!notificationExists) {
        throw new NotFoundException('Notification not found');
      }

      user.notifications = user.notifications.filter(
        (notification) => notification.id !== deleteNotificationDto.id.id,
      );

      const updatedUser = await this.userRepo.save(user);

      return {
        message: 'Notification deleted successfully',
        notifications: updatedUser.notifications,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting notification');
    }
  }

  async getNotifications(userId: { id: string }) {
    try {
      const user = await this.findOne(userId.id);

      if (!user.notifications) {
        user.notifications = [];
      }

      return user.notifications;
    } catch {
      throw new BadRequestException('Error sending notification to user');
    }
  }
}
