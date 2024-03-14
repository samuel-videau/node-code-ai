import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { Pool, QueryResult } from 'pg';
import winston from 'winston';
import { EnvService } from 'src/env/env.service';
import { ENV_VAR } from 'src/env/types';
import { DebugLogger } from 'src/decorators/debug-logging.decorator';
import { Action, ActionInput, ActionOutput, LlmAction, User, Workflow } from './types';


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
      INSERT INTO user (email, "phoneNumber", credits) VALUES ($1, $2, $3)
    `, [email, phoneNumber, credits]);
  }

  @DebugLogger()
  public async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.client.query(`SELECT * FROM user WHERE email = $1`, [email]);
    if (result.rowCount === 0) return null;
    return result.rows[0] as User;
  }

  @DebugLogger()
  public async updateUserCredits(email: string, credits: number): Promise<void> {
    await this.client.query(`UPDATE user SET credits = $1 WHERE email = $2`, [credits, email]);
  }

  @DebugLogger()
  public async deleteUser(email: string): Promise<void> {
    await this.client.query(`DELETE FROM user WHERE email = $1`, [email]);
  }

    // Insert a new workflow
  @DebugLogger()
  public async insertWorkflow(name: string, description: string, authorId: number, status: number, isPublic: boolean): Promise<void> {
    await this.client.query(`
      INSERT INTO workflow (name, description, "authorId", status, "public")
      VALUES ($1, $2, $3, $4, $5)
    `, [name, description, authorId, status, isPublic]);
  }

  // Get a workflow by ID
  @DebugLogger()
  public async getWorkflowById(id: number): Promise<Workflow | null> {
    const result = await this.client.query(`SELECT * FROM workflow WHERE id = $1`, [id]);
    if (result.rowCount === 0) return null;
    return result.rows[0] as Workflow;
  }

  // Update a workflow's status
  @DebugLogger()
  public async updateWorkflowStatus(id: number, status: number): Promise<void> {
    await this.client.query(`UPDATE workflow SET status = $1 WHERE id = $2`, [status, id]);
  }

  // Delete a workflow by ID
  @DebugLogger()
  public async deleteWorkflow(id: number): Promise<void> {
    await this.client.query(`DELETE FROM workflow WHERE id = $1`, [id]);
  }

  // Insert a new action
  @DebugLogger()
  public async insertAction(jobId: number, name: string, order: number, specificActionType: number): Promise<void> {
    await this.client.query(`
      INSERT INTO action (jobId, name, "order", specificActionType)
      VALUES ($1, $2, $3, $4)
    `, [jobId, name, order, specificActionType]);
  }

  // Get actions by Job ID
  @DebugLogger()
  public async getActionsByJobId(jobId: number): Promise<Action[]> {
    const result = await this.client.query(`SELECT * FROM action WHERE "jobId" = $1`, [jobId]);
    return result.rows as Action[];
  }

  // Update an action's order
  @DebugLogger()
  public async updateActionOrder(id: number, order: number): Promise<void> {
    await this.client.query(`UPDATE action SET "order" = $1 WHERE id = $2`, [order, id]);
  }

  @DebugLogger()
  public async insertActionInput(actionId: number, valueFromInputId: number | null, name: string | null, type: string): Promise<void> {
    await this.client.query(`
      INSERT INTO action_input (actionId, valueFromInputId, name, type)
      VALUES ($1, $2, $3, $4)
    `, [actionId, valueFromInputId, name, type]);
  }

  @DebugLogger()
  public async getActionInputByActionId(actionId: number): Promise<ActionInput[]> {
    const result = await this.client.query(`SELECT * FROM action_input WHERE actionId = $1`, [actionId]);
    return result.rows as ActionInput[];
  }

  @DebugLogger()
  public async updateActionInput(id: number, valueFromInputId: number | null, name: string | null, type: string): Promise<void> {
    await this.client.query(`
      UPDATE action_input SET valueFromInputId = $2, name = $3, type = $4 WHERE id = $1
    `, [id, valueFromInputId, name, type]);
  }

  @DebugLogger()
  public async deleteActionInput(id: number): Promise<void> {
    await this.client.query(`DELETE FROM action_input WHERE id = $1`, [id]);
  }

  // ActionOutput CRUD Operations
  @DebugLogger()
  public async insertActionOutput(actionId: number, name: string, type: string): Promise<void> {
    await this.client.query(`
      INSERT INTO action_output (actionId, name, type)
      VALUES ($1, $2, $3)
    `, [actionId, name, type]);
  }

  @DebugLogger()
  public async getActionOutputByActionId(actionId: number): Promise<ActionOutput[]> {
    const result = await this.client.query(`SELECT * FROM action_output WHERE actionId = $1`, [actionId]);
    return result.rows as ActionOutput[];
  }

  @DebugLogger()
  public async updateActionOutput(id: number, name: string, type: string): Promise<void> {
    await this.client.query(`
      UPDATE action_output SET name = $2, type = $3 WHERE id = $1
    `, [id, name, type]);
  }

  @DebugLogger()
  public async deleteActionOutput(id: number): Promise<void> {
    await this.client.query(`DELETE FROM action_output WHERE id = $1`, [id]);
  }

  // Delete an action by ID
  @DebugLogger()
  public async deleteAction(id: number): Promise<void> {
    await this.client.query(`DELETE FROM action WHERE id = $1`, [id]);
  }

  // Insert a new LLM action
  @DebugLogger()
  public async insertLlmAction(actionId: number, model: string, assistant: string, system: string, user: string, frequencyPenalty: number, presencePenalty: number, maxTokens: number, n: number, seed: number, temperature: number, topP: number): Promise<void> {
    await this.client.query(`
      INSERT INTO llm_action (actionId, model, assistant, system, user, frequencyPenalty, presencePenalty, maxTokens, n, seed, temperature, topP)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [actionId, model, assistant, system, user, frequencyPenalty, presencePenalty, maxTokens, n, seed, temperature, topP]);
  }

  // Get LLM actions by Action ID
  @DebugLogger()
  public async getLlmActionsByActionId(actionId: number): Promise<LlmAction[]> {
    const result = await this.client.query(`SELECT * FROM llm_action WHERE "actionId" = $1`, [actionId]);
    return result.rows as LlmAction[];
  }

  // Update an LLM action's model
  @DebugLogger()
  public async updateLlmActionModel(id: number, model: string): Promise<void> {
    await this.client.query(`UPDATE llm_action SET model = $1 WHERE id = $2`, [model, id]);
  }

  // Delete an LLM action by ID
  @DebugLogger()
  public async deleteLlmAction(id: number): Promise<void> {
    await this.client.query(`DELETE FROM llm_action WHERE id = $1`, [id]);
  }
}
