import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthData } from './dto/auth-data.dto';
import { AuthBody, RefreshBody } from './dto/auth-body.dto';

@ApiTags('Модуль авторизации')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Авторизация по номеру телефона + паролю',
  })
  @ApiResponse({
    status: 200,
    type: AuthData,
  })
  @ApiResponse({
    status: 201,
    type: AuthData,
  })
  @HttpCode(200)
  async signin(@Body() body: AuthBody): Promise<AuthData> {
    return await this.authService.signin(body);
  }

  @Post('/refresh')
  @ApiOperation({
    summary: 'Обновление токена',
  })
  @ApiResponse({
    status: 200,
    type: AuthData,
  })
  @HttpCode(200)
  async refresh(@Body() body: RefreshBody): Promise<AuthData> {
    return await this.authService.refresh(body);
  }
}
