import { UserRole } from '@users/dto/user.dto';

export class InviteMemberDto {
  email: string;
  role: UserRole;
  locale: string;
  ownerId: string;
}
