import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionService {
  constructor(private readonly dbService: DbService) {}

  async create(workflowId: number, createActionDto: CreateActionDto) {
    await this.dbService.insertAction(
      workflowId,
      createActionDto.name,
      createActionDto.order,
      createActionDto.specificActionType,
    );
    return 'This action adds a new action';
  }

  async findAll(workflowId: number) {
    // Assuming there's a method to get all actions or you might need to adjust based on your db service capabilities
    const actions = await this.dbService.getActionsByWorkflowId(workflowId); // This method needs to be implemented in DbService
    return actions;
  }

  async findOne(id: number) {
    const action = await this.dbService.getActionById(id); // Adjust method name as per your DbService
    if (!action) throw new Error('Action not found');
    else return action;
  }

  async update(id: number, updateActionDto: UpdateActionDto) {
    // Assuming your DbService has an updateAction method or you might need to implement it
    await this.dbService.updateAction(id, updateActionDto); // This method needs to be adjusted or implemented
  }

  async remove(id: number) {
    await this.dbService.deleteAction(id);
  }
}
