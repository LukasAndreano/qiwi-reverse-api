import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokens } from 'src/entities/auth_tokens.entity';
import { Users } from 'src/entities/users.entity';
import { Tokens } from 'src/entities/tokens.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([Users, Tokens, AuthTokens])],
})
export class AuthModule {}
