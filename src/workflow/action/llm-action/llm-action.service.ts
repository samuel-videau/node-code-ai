import { Injectable } from '@nestjs/common';
import { UpdateLlmActionDto } from './dto/update-llm-action.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class LlmActionService {
  
  constructor(private dbService: DbService) {}

  async update(id: number, updateDto: UpdateLlmActionDto) {
    return this.dbService.updateLlmAction(id, updateDto);
  }

}
