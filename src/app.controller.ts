import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './db/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthz')
  healthz(): string {
    return 'ok';
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
