import { WalletEntity } from 'src/modules/wallet/entities/wallet.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  copydrive: string;

  @Column({ type: 'varchar', nullable: true })
  otp: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiration: Date | null;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user, {
    cascade: true,
  })
  wallets: WalletEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
