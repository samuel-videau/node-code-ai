import { Injectable } from '@nestjs/common';
import { CreateActionInputDto } from './dto/create-input.dto';
import { UpdateActionInputDto } from './dto/update-input.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class InputService {
  constructor(private readonly dbService: DbService) {}

  async create(actionId: number, createInputDto: CreateActionInputDto) {
    await this.dbService.insertActionInput(
      actionId,
      createInputDto.valueFromOutputId,
      createInputDto.name,
      createInputDto.type
    );
    return 'This action adds a new input';
  }

  async findAll(actionId: number) {
    const inputs = await this.dbService.getActionInputByActionId(actionId);
    return inputs;
  }

  async update(id: number, updateInputDto: UpdateActionInputDto) {
    await this.dbService.updateActionInput(
      id,
      updateInputDto
    );
  }

  async remove(id: number) {
    await this.dbService.deleteActionInput(id);
    return `This action removes a #${id} input`;
  }
}
