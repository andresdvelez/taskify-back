import { UserRole } from '@users/dto/user.dto';

export interface TokenPayload {
  email: string;
  invitedBy: string;
  role: UserRole;
}

export interface SignUpWithTokenDto {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}
