import { Module } from '@nestjs/common';
import { TokenUpdaterService } from './token-updater.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from 'src/entities/tokens.entity';
import { Users } from 'src/entities/users.entity';
import { AuthTokens } from 'src/entities/auth_tokens.entity';

@Module({
  providers: [TokenUpdaterService],
  imports: [TypeOrmModule.forFeature([Tokens, Users, AuthTokens])],
})
export class TokenUpdaterModule {}
