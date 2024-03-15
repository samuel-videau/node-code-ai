import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { Pool, QueryResult } from 'pg';
import winston from 'winston';
import { EnvService } from 'src/env/env.service';
import { ENV_VAR } from 'src/env/types';
import { DebugLogger } from 'src/decorators/debug-logging.decorator';
import { Action, ActionInput, ActionOutput, DATABASE_TABLE, LlmAction, User, Workflow } from './types';
import { UpdateWorkflowDto } from 'src/workflow/dto/update-workflow.dto';
import { UpdateActionDto } from 'src/workflow/action/dto/update-action.dto';
import { UpdateActionInputDto } from 'src/workflow/action/input/dto/update-input.dto';


@Injectable()
export class DbService implements OnModuleDestroy {
  protected readonly client: Pool & {
    query: (query: string, values?: any[]) => Promise<QueryResult<any>>;
  };
  protected readonly logger: winston.Logger;

  constructor(protected readonly loggerService: LoggerService, protected readonly envService: EnvService) {
    this.logger = this.loggerService.getChildLogger('YourDbLoggerName');
    this.client = new Pool({ connectionString: this.envService.getEnvOrThrow(ENV_VAR.POSTGRES_URI) });
  }

  @DebugLogger()
  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  @DebugLogger()
  public async disconnect(): Promise<void> {
    await this.client.end();
  }

  // USER CRUD Operations
  @DebugLogger()
  public async insertUser(email: string, phoneNumber?: string, credits: number = 5000000): Promise<void> {
    await this.client.query(`
      INSERT INTO ${DATABASE_TABLE.USER} (email, "phoneNumber", credits) VALUES ($1, $2, $3)
    `, [email, phoneNumber, credits]);
  }

  @DebugLogger()
  public async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.USER} WHERE email = $1`, [email]);
    if (result.rowCount === 0) return null;
    return result.rows[0] as User;
  }

  @DebugLogger()
  public async getUsers(): Promise<User[]> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.USER}`);
    return result.rows as User[];
  }

  @DebugLogger()
  public async updateUserCredits(email: string, credits: number): Promise<void> {
    await this.client.query(`UPDATE ${DATABASE_TABLE.USER} SET credits = $1 WHERE email = $2`, [credits, email]);
  }

  @DebugLogger()
  public async deleteUser(email: string): Promise<void> {
    await this.client.query(`DELETE FROM ${DATABASE_TABLE.USER} WHERE email = $1`, [email]);
  }

    // Insert a new workflow
  @DebugLogger()
  public async insertWorkflow(name: string, description: string, authorId: number, status: number, isPublic: boolean): Promise<void> {
    await this.client.query(`
      INSERT INTO ${DATABASE_TABLE.WORKFLOW} (name, description, "authorId", status, "public")
      VALUES ($1, $2, $3, $4, $5)
    `, [name, description, authorId, status, isPublic]);
  }

  // Get a workflow by ID
  @DebugLogger()
  public async getWorkflowById(id: number): Promise<Workflow | null> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.WORKFLOW} WHERE id = $1`, [id]);
    if (result.rowCount === 0) return null;
    return result.rows[0] as Workflow;
  }

  @DebugLogger()
  public async getWorkflowsByAuthorId(authorId: number): Promise<Workflow[]> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.WORKFLOW} WHERE "authorId" = $1`, [authorId]);
    return result.rows as Workflow[];
  }

  // Update a workflow's status
  @DebugLogger()
  public async updateWorkflow(id: number, updateFields: UpdateWorkflowDto): Promise<void> {
    // Construct the SET part of the SQL query dynamically based on the updateFields object
    const setQuery = Object.keys(updateFields)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');
    
    // Extract the values from the updateFields object for parameterized query
    const values = Object.values(updateFields);

    // Add the ID to the end of the values array for the WHERE clause
    values.push(id);

    // Execute the update query
    await this.client.query(`UPDATE ${DATABASE_TABLE.WORKFLOW} SET ${setQuery} WHERE id = $${values.length}`, values);
  }

  // Delete a workflow by ID
  @DebugLogger()
  public async deleteWorkflow(id: number): Promise<void> {
    await this.client.query(`DELETE FROM ${DATABASE_TABLE.WORKFLOW} WHERE id = $1`, [id]);
  }

  // Insert a new action
  @DebugLogger()
  public async insertAction(workflowId: number, name: string, order: number, specificActionType: string): Promise<void> {
    await this.client.query(`
      INSERT INTO ${DATABASE_TABLE.ACTION} ("workflowId", name, "order", "specificActionType")
      VALUES ($1, $2, $3, $4)
    `, [workflowId, name, order, specificActionType]);
  }

  @DebugLogger()
  public async getActionById(id: number): Promise<Action | null> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.ACTION} WHERE id = $1`, [id]);
    if (result.rowCount === 0) return null;
    return result.rows[0] as Action;
  }

  // Get actions by Job ID
  @DebugLogger()
  public async getActionsByWorkflowId(workflowId: number): Promise<Action[]> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.ACTION} WHERE "workflowId" = $1`, [workflowId]);
    return result.rows as Action[];
  }

  // Update an action's order
  @DebugLogger()
public async updateAction(id: number, updateActionDto: UpdateActionDto): Promise<void> {
  // Construct the SET part of the SQL query dynamically based on the updateActionDto object
  const setQueryParts = [];
  const queryParams = [];

  Object.keys(updateActionDto).forEach((key, index) => {
    setQueryParts.push(`"${key}" = $${index + 1}`);
    queryParams.push(updateActionDto[key]);
  });

  queryParams.push(id); // Add the id as the last parameter for the WHERE clause

  const setQuery = setQueryParts.join(', ');
  const query = `UPDATE ${DATABASE_TABLE.ACTION} SET ${setQuery} WHERE id = $${queryParams.length}`;

  await this.client.query(query, queryParams);
}

  // Delete an action by ID
  @DebugLogger()
  public async deleteAction(id: number): Promise<void> {
    await this.client.query(`DELETE FROM ${DATABASE_TABLE.ACTION} WHERE id = $1`, [id]);
  }

  @DebugLogger()
  public async insertActionInput(actionId: number, valueFromOutputId: number | null, name: string | null, type: string): Promise<void> {
    await this.client.query(`
      INSERT INTO ${DATABASE_TABLE.ACTION_INPUT} (actionId, valueFromOutputId, name, type)
      VALUES ($1, $2, $3, $4)
    `, [actionId, valueFromOutputId, name, type]);
  }

  @DebugLogger()
  public async getActionInputByActionId(actionId: number): Promise<ActionInput[]> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.ACTION_INPUT} WHERE actionId = $1`, [actionId]);
    return result.rows as ActionInput[];
  }

  @DebugLogger()
  public async updateActionInput(id: number, updateDto: UpdateActionInputDto): Promise<void> {
    // Construct the SQL SET clause dynamically based on the DTO's properties
    const entries = Object.entries(updateDto);
    const setClause = entries
      .map(([key, _], index) => `"${key}" = $${index + 2}`)
      .join(', ');

    // The first query parameter is the ID, followed by the DTO's values
    const queryParams = [id, ...entries.map(([, value]) => value)];

    await this.client.query(`
      UPDATE ${DATABASE_TABLE.ACTION_INPUT} SET ${setClause} WHERE id = $1
    `, queryParams);
  }

  @DebugLogger()
  public async deleteActionInput(id: number): Promise<void> {
    await this.client.query(`DELETE FROM ${DATABASE_TABLE.ACTION_INPUT} WHERE id = $1`, [id]);
  }

  // ActionOutput CRUD Operations
  @DebugLogger()
  public async insertActionOutput(actionId: number, name: string, type: string): Promise<void> {
    await this.client.query(`
      INSERT INTO ${DATABASE_TABLE.ACTION_OUTPUT} (actionId, name, type)
      VALUES ($1, $2, $3)
    `, [actionId, name, type]);
  }

  @DebugLogger()
  public async getActionOutputByActionId(actionId: number): Promise<ActionOutput[]> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.ACTION_OUTPUT} WHERE actionId = $1`, [actionId]);
    return result.rows as ActionOutput[];
  }

  @DebugLogger()
  public async updateActionOutput(id: number, name: string, type: string): Promise<void> {
    await this.client.query(`
      UPDATE ${DATABASE_TABLE.ACTION_OUTPUT} SET name = $2, type = $3 WHERE id = $1
    `, [id, name, type]);
  }

  @DebugLogger()
  public async deleteActionOutput(id: number): Promise<void> {
    await this.client.query(`DELETE FROM ${DATABASE_TABLE.ACTION_OUTPUT} WHERE id = $1`, [id]);
  }

  // Insert a new LLM action
  @DebugLogger()
  public async insertLlmAction(llmAction: Omit<LlmAction, 'id'>): Promise<void> {
    await this.client.query(`
      INSERT INTO ${DATABASE_TABLE.LLM_ACTION} (actionId, model, assistant, system, user, frequencyPenalty, presencePenalty, maxTokens, n, seed, temperature, topP)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [llmAction.actionId, llmAction.model, llmAction.assistant, llmAction.system, llmAction.user, llmAction.frequencyPenalty, llmAction.presencePenalty, llmAction.maxTokens, llmAction.n, llmAction.seed, llmAction.temperature, llmAction.topP]);
  }

  // Get LLM actions by Action ID
  @DebugLogger()
  public async getLlmActionsByActionId(actionId: number): Promise<LlmAction[]> {
    const result = await this.client.query(`SELECT * FROM ${DATABASE_TABLE.LLM_ACTION} WHERE "actionId" = $1`, [actionId]);
    return result.rows as LlmAction[];
  }

  // Update an LLM action's model
  @DebugLogger()
  public async updateLlmActionModel(id: number, model: string): Promise<void> {
    await this.client.query(`UPDATE ${DATABASE_TABLE.LLM_ACTION} SET model = $1 WHERE id = $2`, [model, id]);
  }

  // Delete an LLM action by ID
  @DebugLogger()
  public async deleteLlmAction(id: number): Promise<void> {
    await this.client.query(`DELETE FROM ${DATABASE_TABLE.LLM_ACTION} WHERE id = $1`, [id]);
  }
}
