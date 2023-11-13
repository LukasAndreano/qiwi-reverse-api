import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTokens } from 'src/entities/auth_tokens.entity';
import { Tokens } from 'src/entities/tokens.entity';
import { Users } from 'src/entities/users.entity';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import getQiwiToken from 'src/utils/getQiwiToken.utils';
import { Repository } from 'typeorm';

@Injectable()
export class TokenUpdaterService {
  constructor(
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(AuthTokens)
    private readonly authTokensRepository: Repository<AuthTokens>,
  ) {}

  @Cron('* * * * *')
  async handleCron() {
    const tokens = await this.tokensRepository
      .createQueryBuilder('tokens')
      .select([
        'tokens.id as id',
        'tokens.created_by as created_by',
        'users.phone as phone',
        'users.password as password',
      ])
      .where('tokens.created_at < :created_at', {
        created_at: getCurrentTimestamp() - 3600 * 2,
      })
      .innerJoin('tokens.created_by', 'users')
      .getRawMany();

    for await (const el of tokens) {
      await this.tokensRepository
        .createQueryBuilder('tokens')
        .delete()
        .where('tokens.id = :id', { id: el.id })
        .execute();

      let access_token;
      let attempts = 0;

      while (attempts <= 20) {
        try {
          access_token = await getQiwiToken(el.phone, el.password);

          if (access_token) break;
        } catch (e) {
          console.log(e);
        }

        attempts++;

        await new Promise((resolve) => setTimeout(resolve, 10000 * 6));
      }

      if (!access_token) {
        await this.authTokensRepository
          .createQueryBuilder('auth_tokens')
          .delete()
          .where('auth_tokens.created_by = :created_by', {
            created_by: el.created_by,
          })
          .execute();

        await this.tokensRepository
          .createQueryBuilder('tokens')
          .delete()
          .where('tokens.created_by = :created_by', {
            created_by: el.created_by,
          })
          .execute();

        await this.usersRepository
          .createQueryBuilder('users')
          .delete()
          .where('users.id = :id', { id: el.created_by })
          .execute();

        continue;
      }

      await this.tokensRepository
        .createQueryBuilder('tokens')
        .insert()
        .values({
          created_by: el.created_by,
          access_token,
          created_at: getCurrentTimestamp(),
        })
        .execute();
    }
  }
}
