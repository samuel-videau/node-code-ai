export enum DATABASE_TABLE {
    USER = '"user"',
    WORKFLOW = 'workflow',
    ACTION = 'action',
    LLM_ACTION = 'llm_action'
}

export interface User {
    id: number;
    email: string;
    phoneNumber: string;
    credits: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Workflow {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Action {
    id: number;
    jobId: number;
    name: string;
    order: number;
    specificActionType: number;
    createdAt: Date;
}

type JsonObject = { [key: string]: string | number | boolean | JsonObject | JsonObject[] };

export interface LlmAction {
    id: number;
    actionId: number;
    model: string;
    assistant?: string;
    system?: string;
    user?: string;
    responseType: string;
    frequencyPenalty: number | null;
    presencePenalty: number | null;
    maxTokens: number | null;
    n: number; // default 1
    seed: number | null;
    temperature: number; // default 1
    topP: number; // default 1
}