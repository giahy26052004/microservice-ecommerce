import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/test')
  getTest(): string {
    return this.appService.getTest();
  }
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = req.csrfToken();
    return res.json({ csrfToken });
  }
}
