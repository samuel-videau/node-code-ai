export enum DATABASE_TABLE {
    USER = '"user"',
    WORKFLOW = 'workflow',
    ACTION = 'action',
    ACTION_INPUT = 'action_input',
    ACTION_OUTPUT = 'action_output',
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
    description: string;
    authorId: number;
    status: number;
    public: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Action {
    id: number;
    jobId: number;
    name: string;
    order: number;
    specificActionType: string;
    createdAt: Date;
}

export interface ActionInput {
    id: number;
    actionId: number;
    valueFromInputId: number | null;
    name: string | null;
    type: string;
    createdAt: Date;
}

export interface ActionOutput {
    id: number;
    actionId: number;
    name: string;
    type: string;
    createdAt: Date;
}

export interface LlmAction {
    id: number;
    actionId: number;
    model: string;
    assistant?: string;
    system?: string;
    user?: string;
    frequencyPenalty: number | null;
    presencePenalty: number | null;
    maxTokens: number | null;
    n: number; // default 1
    seed: number | null;
    temperature: number; // default 1
    topP: number; // default 1
}