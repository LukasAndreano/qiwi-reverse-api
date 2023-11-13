import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Tokens } from 'src/entities/tokens.entity';
import { Repository } from 'typeorm';
import { RequestBody } from './dto/request-body.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import axios from 'axios';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}

  async request(user: UserDataDto, body: RequestBody) {
    const token = await this.tokensRepository
      .createQueryBuilder('tokens')
      .select(['tokens.access_token as access_token'])
      .where('tokens.created_by = :created_by', { created_by: user.id })
      .orderBy('tokens.id', 'DESC')
      .getRawOne();

    if (!token) errorGenerator(Errors.AUTH_PARAMS_NOT_VALID);

    try {
      const req = await axios({
        method: body.method,
        url: `https://edge.qiwi.com/${body.endpoint}${
          body.method === 'GET'
            ? `?${Object.keys(body.params)
                .map((el) => `${el}=${body.params[el]}`)
                .join('&')}`
            : ''
        }`,
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        data: body?.method === 'POST' ? body.params : undefined,
      });

      return req.data;
    } catch (e) {
      return e.response.data;
    }
  }
}
