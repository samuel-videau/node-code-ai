import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service'; // Adjust the import path as necessary
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Workflow } from 'src/db/types';

@Injectable()
export class WorkflowService {
  constructor(private readonly dbService: DbService) {}

  async create(createWorkflowDto: CreateWorkflowDto): Promise<void> {
    await this.dbService.insertWorkflow(
      createWorkflowDto.name,
      createWorkflowDto.description,
      createWorkflowDto.authorId,
      createWorkflowDto.isPublic,
    );
  }

  async findAll(authorId: number): Promise<Workflow[]> {
    return this.dbService.getWorkflowsByAuthorId(authorId);
  }

  async findOne(id: number): Promise<Workflow | null> {
    return this.dbService.getWorkflowById(id);
  }

  async update(id: number, updateWorkflowDto: UpdateWorkflowDto): Promise<void> {
    await this.dbService.updateWorkflow(id, updateWorkflowDto);
  }

  async remove(id: number): Promise<void> {
    await this.dbService.deleteWorkflow(id);
  }
}
