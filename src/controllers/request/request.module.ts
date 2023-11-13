import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from 'src/entities/tokens.entity';

@Module({
  controllers: [RequestController],
  providers: [RequestService],
  imports: [TypeOrmModule.forFeature([Tokens])],
})
export class RequestModule {}
