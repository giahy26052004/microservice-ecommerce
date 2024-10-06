import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformationInterceptor } from './responseInterceptor';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  const csrfProtection = csurf({ cookie: true });
  app.use(csrfProtection);
  app.setGlobalPrefix(config.get('appPrefix'));
  app.useGlobalInterceptors(new TransformationInterceptor());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(config.get('port'), () => {
    return console.log(`Server is running on port ${config.get('port')}`);
  });
}

export const BASE_PATH = join(__dirname, '..', 'views');

bootstrap();
