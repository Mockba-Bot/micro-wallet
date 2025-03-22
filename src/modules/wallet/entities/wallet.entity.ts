import { NetworkEntity } from 'src/modules/network/entities/network.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'wallets' })
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.wallets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({
    nullable: false,
    unique: false,
  })
  address!: string;

  @ManyToOne(() => NetworkEntity)
  network: NetworkEntity;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;
}
