import { UserRole } from '@taskify/dto/user.dto';

export class InviteMemberDto {
  email: string;
  role: UserRole;
  locale: string;
  ownerId: string;
}
