import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { Roles } from 'src/shared/middleware/role.decorator';
import { UserType } from 'src/shared/schema/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('/verify-email/:otp/:email')
  async verifyEmail(@Param('otp') otp: string, @Param('email') email: string) {

    return await this.usersService.verifyEmail(otp, email);
  }
  @Get()
  @Roles(UserType.ADMIN)
  findAll(@Query('type') type: string) {
    return this.usersService.findAll(type);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUser: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginRes = await this.usersService.login(
      loginUser.email,
      loginUser.password,
    );

    if (loginRes.success) {
      response.cookie('_auth_token', loginRes.result?.token, {
        httpOnly: true,
      });
    }
    delete loginRes.result?.token;
    return {
      success: true,
      message: 'Login successful',
      result: loginRes.result?.user,
    };
  }
  @Put('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('_auth_token');
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
  @Put('/forgot-password/:email')
  async forgotPassword(@Param('email') email: string) {
    return this.usersService.forgotPassword(email);
  }

  @Put('/confirmForgot')
  async confirmForgot(@Body() data: any) {
    return this.usersService.confirmForgot(data);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
