import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestService } from './request.service';
import { RequestBody } from './dto/request-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Модуль запросов')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiOperation({
    summary: 'Запрос к QIWI API',
  })
  async request(@Body() body: RequestBody, @Headers('user') user: UserDataDto) {
    return await this.requestService.request(user, body);
  }
}
