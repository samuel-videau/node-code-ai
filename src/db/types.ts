export enum DATABASE_TABLE {
    USER = '"user"',
    WORKFLOW = 'workflow',
    ACTION = 'action',
    DEPENDENCY = 'dependency',
    CONDITIONAL_DEPENDENCY = 'conditional_dependency',
    ACTION_INPUT = 'action_input',
    ACTION_OUTPUT = 'action_output',
    LLM_ACTION = 'llm_action'
}

export enum DATABASE_TYPE {
    CONDITION_TYPE = 'condition_type',
    ACTION_TYPE = 'action_type'
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
    workflowId: number;
    name: string;
    order: number;
    specificActionType: string;
    createdAt: Date;
}

export interface Dependency {
    id: number;
    workflowId: number;
    precedingActionId: number; // Refers to the Action.id that precedes this one
    succeedingActionId: number; // Refers to the Action.id that follows this one
    createdAt: Date; // The date and time when the dependency was created
}

export interface ConditionalDependency {
    id: number;
    workflowId: number;
    precedingActionId: number; // Refers to the Action.id that precedes this conditional dependency
    successActionId: number | null; // Refers to the Action.id to be followed if the condition is met (success path)
    failureActionId: number | null; // Refers to the Action.id to be followed if the condition is not met (failure path)
    conditionType: DATABASE_TYPE.CONDITION_TYPE; // The type of condition to evaluate
    valueAType: string; // Describes the type of valueA (e.g., 'literal', 'input', 'output')
    valueAId: number | null; // Optional ID related to valueA, applicable if valueA refers to an input or output
    valueALiteral: string | null; // The literal value of valueA, if applicable
    valueBType: string; // Describes the type of valueB (e.g., 'literal', 'input', 'output')
    valueBId: number | null; // Optional ID related to valueB, applicable if valueB refers to an input or output
    valueBLiteral: string | null; // The literal value of valueB, if applicable
    createdAt: Date; // The date and time when the conditional dependency was created
}


export interface ActionInput {
    id: number;
    actionId: number;
    valueFromOutputId: number | null;
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