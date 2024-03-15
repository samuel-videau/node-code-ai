import { Injectable } from '@nestjs/common';
import { CreateOutputDto } from './dto/create-output.dto';
import { UpdateOutputDto } from './dto/update-output.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class OutputService {
  constructor(private dbService: DbService) {}

  async create(actionId: number, createOutputDto: CreateOutputDto) {
    await this.dbService.insertActionOutput(
      actionId,
      createOutputDto.name,
      createOutputDto.type
    );
    return 'This action adds a new output';
  }

  async findAll(actionId: number) {
    const outputs = await this.dbService.getActionOutputByActionId(actionId);
    return outputs;
  }

  async update(id: number, updateOutputDto: UpdateOutputDto) {
    await this.dbService.updateActionOutput(
      id,
      updateOutputDto
    );
  }

  async remove(id: number) {
    await this.dbService.deleteActionOutput(id);
  }
}
