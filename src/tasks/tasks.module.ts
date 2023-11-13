import { Module } from '@nestjs/common';
import { TokenUpdaterModule } from './token-updater/token-updater.module';

@Module({
  imports: [TokenUpdaterModule],
})
export class TasksModule {}
