import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { updateTokens } from 'src/utils/authHelper.utils';
import { Repository } from 'typeorm';
import { AuthBody, RefreshBody } from './dto/auth-body.dto';
import { AuthData } from './dto/auth-data.dto';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import * as jwt from 'jsonwebtoken';
import { AuthTokens } from 'src/entities/auth_tokens.entity';
import { Tokens } from 'src/entities/tokens.entity';
import getQiwiToken from 'src/utils/getQiwiToken.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(AuthTokens)
    private readonly authTokensRepository: Repository<AuthTokens>,

    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}

  async refresh(body: RefreshBody): Promise<AuthData> {
    try {
      const refresh: any = jwt.verify(
        body.refresh_token,
        process.env.JWT_SECRET,
      );

      if (refresh.type !== 'refresh_token')
        errorGenerator(Errors.AUTH_PARAMS_NOT_VALID);

      const findInDB = await this.authTokensRepository
        .createQueryBuilder('auth_tokens')
        .select(['auth_tokens.id as id'])
        .where('auth_tokens.refresh_token = :refresh_token', {
          refresh_token: body.refresh_token,
        })
        .andWhere('auth_tokens.created_by = :created_by', {
          created_by: refresh.user_id,
        })
        .getRawOne();

      if (!findInDB) errorGenerator(Errors.AUTH_PARAMS_NOT_VALID);

      const tokens = await updateTokens(refresh.user_id);

      await this.authTokensRepository
        .createQueryBuilder('auth_tokens')
        .delete()
        .where('auth_tokens.id = :id', { id: findInDB.id })
        .andWhere('auth_tokens.created_by = :created_by', {
          created_by: refresh.user_id,
        })
        .execute();

      await this.authTokensRepository
        .createQueryBuilder('auth_tokens')
        .insert()
        .into(AuthTokens)
        .values({
          created_at: getCurrentTimestamp(),
          created_by: refresh.user_id,
          refresh_token: tokens.refresh_token,
        })
        .execute();

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (e) {
      console.log(e);
      errorGenerator(Errors.AUTH_PARAMS_NOT_VALID);
    }
  }

  async signin(body: AuthBody): Promise<AuthData> {
    let access_token = await getQiwiToken(
      body.phone.replace('+', ''),
      body.password,
    );

    if (!access_token) errorGenerator(Errors.CANT_GET_TOKEN);

    access_token = String(access_token);

    const findUser = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id as id'])
      .where('users.phone = :phone', {
        phone: body.phone,
      })
      .andWhere('users.password = :password', {
        password: body.password,
      })
      .getRawOne();

    if (!findUser) {
      const insertUser = await this.usersRepository
        .createQueryBuilder('users')
        .insert()
        .into(Users)
        .values({
          phone: body.phone,
          password: body.password,
          updated_at: getCurrentTimestamp(),
          joined_at: getCurrentTimestamp(),
        })
        .execute();

      const tokens = await updateTokens(insertUser.raw.insertId);

      await this.tokensRepository
        .createQueryBuilder('tokens')
        .insert()
        .into(Tokens)
        .values({
          created_at: getCurrentTimestamp(),
          created_by: insertUser.raw.insertId,
          access_token,
        })
        .execute();

      await this.authTokensRepository
        .createQueryBuilder('auth_tokens')
        .insert()
        .into(AuthTokens)
        .values({
          created_at: getCurrentTimestamp(),
          created_by: insertUser.raw.insertId,
          refresh_token: tokens.refresh_token,
        })
        .execute();

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } else {
      const tokens = await updateTokens(findUser.id);

      await this.tokensRepository
        .createQueryBuilder('tokens')
        .insert()
        .into(Tokens)
        .values({
          created_at: getCurrentTimestamp(),
          created_by: findUser.id,
          access_token,
        })
        .execute();

      await this.authTokensRepository
        .createQueryBuilder('auth_tokens')
        .insert()
        .into(AuthTokens)
        .values({
          created_at: getCurrentTimestamp(),
          created_by: findUser.id,
          refresh_token: tokens.refresh_token,
        })
        .execute();

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    }
  }
}
