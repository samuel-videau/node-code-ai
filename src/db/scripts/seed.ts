import { config } from 'dotenv';
import {Client} from 'pg';

import { DATABASE_TABLE, DATABASE_TYPE } from '../types';

config();
const POSTGRES_URI = process.env.POSTGRES_URI;


const dbName = POSTGRES_URI.split('/').pop();
const defaultConnectionString = POSTGRES_URI.replace(`/${dbName}`, '');

let client = new Client({ connectionString: defaultConnectionString });

export const seedDb = async (dropTables?: boolean): Promise<void> => {
  await waitForDB();

  // Check if the target database exists
  const dbExistsResult = await client.query(`
    SELECT 1 FROM pg_database WHERE datname='${dbName}'
  `);
  if (dbExistsResult.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }

  await client.end();

  client = new Client({ connectionString: POSTGRES_URI });

  await client.connect();

  if (dropTables) {
    for (const table of Object.keys(DATABASE_TABLE).values())
      await client.query(`DROP TABLE IF EXISTS ${DATABASE_TABLE[table]} CASCADE`);
    for (const type of Object.keys(DATABASE_TYPE).values())
      await client.query(`DROP TYPE IF EXISTS ${DATABASE_TYPE[type]}`);
  }

  console.log('Creating tables...');

  try {
    await client.query(`
      CREATE TYPE ${DATABASE_TYPE.CONDITION_TYPE} AS ENUM (
        'EQUALS',
        'NOT_EQUALS',
        'GREATER_THAN',
        'LESS_THAN',
        'GREATER_THAN_OR_EQUAL',
        'LESS_THAN_OR_EQUAL',
        'CONTAINS',
        'NOT_CONTAINS'
        );
    `);
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('User table already exists');
    } else throw err;
  }

  try {
    await client.query(`
      CREATE TYPE ${DATABASE_TYPE.ACTION_TYPE} AS ENUM (
        'HTTP',
        'LLM'
      );
    `);
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('User table already exists');
    } else throw err;
  }

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.USER} (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "phoneNumber" VARCHAR(32),
      "credits" BIGINT NOT NULL DEFAULT 5000000,
      "createdAt" TIMESTAMPTZ DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  
  

  // Create Workflow table
  // Status 0: Draft, 1: Published
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.WORKFLOW} (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "authorId" INTEGER NOT NULL,
      "status" INTEGER NOT NULL DEFAULT 0,
      "public" BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CHECK (status BETWEEN 0 AND 1),
      FOREIGN KEY ("authorId") REFERENCES ${DATABASE_TABLE.USER}("id")
    )
  `);

  // Create Action table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.ACTION} (
      "id" SERIAL PRIMARY KEY,
      "workflowId" INTEGER NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "specificActionType" ${DATABASE_TYPE.ACTION_TYPE} NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("workflowId") REFERENCES ${DATABASE_TABLE.WORKFLOW}("id") ON DELETE CASCADE
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.DEPENDENCY} (
      id SERIAL PRIMARY KEY,
      precedingActionId INTEGER NOT NULL,
      succeedingActionId INTEGER NOT NULL,
      createdAt TIMESTAMPTZ NOT NULL DEFAULT 'NOW()',
      FOREIGN KEY (precedingActionId) REFERENCES ACTION(id),
      FOREIGN KEY (succeedingActionId) REFERENCES ACTION(id)
    );
  `);  

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.CONDITIONAL_DEPENDENCY} (
      id SERIAL PRIMARY KEY,
      precedingActionId INTEGER NOT NULL,
      successActionId INTEGER,
      failureActionId INTEGER,
      conditionType ${DATABASE_TYPE.CONDITION_TYPE} NOT NULL,
      valueAType VARCHAR(255) NOT NULL, -- literal (string number etc) or input or output
      valueAId INTEGER,
      valueALiteral TEXT,
      valueBType VARCHAR(255) NOT NULL, -- literal (string number etc) or input or output
      valueBId INTEGER,
      valueBLiteral TEXT,
      createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY (precedingActionId) REFERENCES ACTION(id),
      FOREIGN KEY (successActionId) REFERENCES ACTION(id),
      FOREIGN KEY (failureActionId) REFERENCES ACTION(id)
    );
  `);


  

  // Create ActionInput table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.ACTION_INPUT} (
      "id" SERIAL PRIMARY KEY,
      "actionId" INTEGER NOT NULL,
      "valueFromOutputId" INTEGER,
      "name" VARCHAR(255) NOT NULL,
      "type" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("actionId") REFERENCES ${DATABASE_TABLE.ACTION}("id") ON DELETE CASCADE,
      FOREIGN KEY ("valueFromOutputId") REFERENCES ${DATABASE_TABLE.ACTION_OUTPUT}("id")
    )
  `);

  // Create ActionOutput table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.ACTION_OUTPUT} (
      "id" SERIAL PRIMARY KEY,
      "actionId" INTEGER NOT NULL,
      "name" VARCHAR(255),
      "type" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("actionId") REFERENCES ${DATABASE_TABLE.ACTION}("id") ON DELETE CASCADE
    )
  `);

  // Create LlmAction table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.LLM_ACTION} (
      "id" SERIAL PRIMARY KEY,
      "actionId" INTEGER NOT NULL,
      "model" VARCHAR(255) NOT NULL,
      "assistant" VARCHAR(255),
      "system" VARCHAR(255),
      "user" VARCHAR(255),
      "frequencyPenalty" FLOAT,
      "presencePenalty" FLOAT,
      "maxTokens" INTEGER,
      "n" INTEGER NOT NULL DEFAULT 1,
      "seed" FLOAT,
      "temperature" FLOAT NOT NULL DEFAULT 1,
      "topP" FLOAT NOT NULL DEFAULT 1,
      CHECK ("frequencyPenalty" BETWEEN -2 AND 2),
      CHECK ("presencePenalty" BETWEEN -2 AND 2),
      CHECK (temperature BETWEEN 0 AND 2),
      FOREIGN KEY ("actionId") REFERENCES ${DATABASE_TABLE.ACTION}("id") ON DELETE CASCADE
    )
  `);

  await client.end();
  console.log('Seed script successfully executed');
};

const waitForDB = async (maxRetries = 20, retryInterval = 1000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await client.connect();
      console.log('Database connection successful!');
      break;
    } catch (err) {
      retries++;
      console.log(`Failed to connect to database, retrying... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }

  if (retries === maxRetries) {
    console.error('Maximum retries reached, unable to connect to database.');
    process.exit(1);
  }
};
