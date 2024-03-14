import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';

@Injectable()
export class AppService {

  constructor(protected readonly dbService: DbService) {
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(email: string): Promise<void> {
    await this.dbService.insertUser(email);
  }
}
