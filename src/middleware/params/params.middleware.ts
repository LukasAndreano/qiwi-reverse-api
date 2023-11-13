import { Injectable, NestMiddleware } from '@nestjs/common';
import { ParamsService } from './params.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  id: number;
}

@Injectable()
export class ParamsMiddleware implements NestMiddleware {
  constructor(private readonly paramsService: ParamsService) {}

  async use(req: any, res: any, next: () => void) {
    const authError = () =>
      res.status(401).json({
        response: false,
        statusCode: 401,
        errorCode: 0,
      });

    if (!req?.headers?.authorization && !req?._parsedUrl?.query)
      return authError();

    const params =
      req?.headers?.authorization?.slice(7) || req?._parsedUrl?.query || '';

    try {
      const { id } = verify(params, process.env.JWT_SECRET) as JwtPayload;

      const user: UserDataDto = await this.paramsService.getUser(id);

      req.headers = {
        ...req.headers,
        user,
      };

      next();
    } catch (e) {
      return authError();
    }
  }
}
