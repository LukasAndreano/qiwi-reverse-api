import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthBody {
  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  @Length(1, 11)
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Пароль от QIWI',
    example: 'PASSWORD_FROM_QIWI',
  })
  @Length(6, 64)
  @IsString()
  password: string;
}

export class RefreshBody {
  @ApiProperty({
    description: 'refresh_token пользователя',
    example: 'refresh_token',
  })
  @IsString()
  @Length(100, 200)
  refresh_token: string;
}
