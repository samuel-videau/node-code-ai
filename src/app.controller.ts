import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './db/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('user')
  async createUser(@Body('email') email: string): Promise<void> {
    await this.appService.createUser(email);
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }
}
