import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParamsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUser(user_id: number): Promise<UserDataDto> {
    const userData = await this.usersRepository
      .createQueryBuilder('users')
      .select(['*'])
      .where('users.id = :id', { id: user_id })
      .getRawOne();

    return userData;
  }
}
