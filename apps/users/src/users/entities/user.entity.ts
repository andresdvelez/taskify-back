import { UserRole } from '@taskify/dto/user.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
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

  // @ManyToMany(() => () => {})

  @Column('simple-array', { nullable: true, default: [] })
  projects: string[];
}
