import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { DeleteDto } from './dtos/delete.dto';
import { EditDto } from './dtos/edit.dto';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.userService.signUp(body);
  }

  @Post('login')
  async login(@Req() req: Request, @Body() body: LoginDto) {
    return await this.userService.login(req, body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Post('edit')
  @UseGuards(AuthGuard)
  async edit(@CurrentUser() user: User, @Body() body: EditDto) {
    return await this.userService.edit(user.id, body);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(@CurrentUser() user: User, @Body() body: DeleteDto) {
    return await this.userService.delete(user.id, body);
  }

  @Get('email-resend')
  @UseGuards(AuthGuard)
  async resendEmail(@CurrentUser() user: User) {
    return await this.userService.resendEmail(user.id);
  }

  @Get('email-verify')
  async verifyEmail(@Query('code') code: string) {
    return await this.userService.verifyEmail(code);
  }

  @Get('/all-nicks')
  @UseGuards(AuthGuard)
  async allNicks() {
    return await this.userService.allNicks();
  }
}
