import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';
import { User } from './db/types';

@Injectable()
export class AppService {

  constructor(protected readonly dbService: DbService) {
  }

  async createUser(email: string): Promise<void> {
    await this.dbService.insertUser(email);
  }

  async getUsers(): Promise<User[]> {
    return this.dbService.getUsers();
  }
}
