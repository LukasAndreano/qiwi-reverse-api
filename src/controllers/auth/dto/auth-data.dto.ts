import { ApiProperty } from '@nestjs/swagger';

export class AuthData {
  @ApiProperty({
    description: 'Токен доступа',
    example: 'token',
  })
  access_token: string;

  @ApiProperty({
    description: 'Токен обновления',
    example: 'token',
  })
  refresh_token: string;
}
