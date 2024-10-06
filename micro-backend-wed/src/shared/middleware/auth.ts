import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { NextFunction, Request, Response } from 'express';
import config from 'config';
import { decodeAuthToken } from '../utility/token-generator';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}
  async use(req: Request | any, res: Response, next: NextFunction) {
    try {
      // Kiểm tra xem request có nằm trong các đường dẫn được bỏ qua không
      if (
        req.method === 'GET' &&
        req.originalUrl.startsWith(`${config.get('appPrefix')}/products`)
      &&  !req.originalUrl.includes("licenses")
      ) {

        return next(); // Bỏ qua kiểm tra token
      }

      const token = req.cookies._auth_token;
      if (!token) {
        throw new UnauthorizedException('Missing authorization token');
      }
      const decodeData: any = await decodeAuthToken(token);
      const user = await this.userDB.findById(decodeData.id);
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      user.password = undefined;
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
