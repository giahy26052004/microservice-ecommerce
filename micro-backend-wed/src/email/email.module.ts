import { Global, Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';

import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailService } from './email.service';
import config from 'config';

import { TEMPLATE_PATH } from 'src/globalPath';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: config.get('SMTP_MAIL'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: 'Becodemy',
        },
        template: {
          dir: TEMPLATE_PATH,
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
