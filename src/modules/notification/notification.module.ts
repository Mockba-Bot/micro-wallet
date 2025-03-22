import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  exports: [NotificationService],
  controllers: [],
  providers: [NotificationService],
})
export class NotificationModule {}
