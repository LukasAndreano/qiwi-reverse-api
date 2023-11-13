import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsObject, IsString, Length } from 'class-validator';

export class RequestBody {
  @ApiProperty({
    description: 'Метод запроса',
    example: 'GET',
  })
  @IsString()
  @Length(3, 4)
  @IsIn(['GET', 'POST'])
  method: string;

  @ApiProperty({
    description: 'Endpoint',
    example: 'sinap/api/v2/terms/31212/payments',
  })
  @IsString()
  @Length(1, 256)
  endpoint: string;

  @ApiProperty({
    description: 'Параметры запроса',
    example: {
      fields: 'account',
    },
  })
  @IsObject()
  params: any;
}
