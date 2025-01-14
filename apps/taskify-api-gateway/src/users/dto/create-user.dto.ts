import { UserRole } from '@taskify/dto/user.dto';

export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
