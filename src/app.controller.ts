import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

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

  @Post('workflow')
  async createWorkflow(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('authorId') authorId: number,
    @Body('status') status: number,
    @Body('isPublic') isPublic: boolean,
  ): Promise<void> {
    await this.appService.createWorkflow(name, description, authorId, status, isPublic);
  }
}
