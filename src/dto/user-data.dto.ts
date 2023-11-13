import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Телефон от QIWI',
    example: '79951275110',
  })
  phone: string;

  @ApiProperty({
    description: 'Пароль от QIWI',
    example: 'PASSWORD',
  })
  password: string;

  @ApiProperty({
    description: 'Дата регистрации пользователя (timestamp)',
    example: 1610000000,
  })
  joined_at: number;
}
