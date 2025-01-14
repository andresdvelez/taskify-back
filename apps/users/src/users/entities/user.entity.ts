import { UserRole } from '@taskify/dto/user.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: '', nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiry: Date;

  @Column('simple-array', { nullable: true, default: [] })
  projects: string[];
}
