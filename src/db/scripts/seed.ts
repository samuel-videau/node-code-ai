import { config } from 'dotenv';
import {Client} from 'pg';

import { DATABASE_TABLE } from '../types';

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
  }

  console.log('Creating tables...');

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
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.WORKFLOW} (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "authorId" INTEGER NOT NULL,
      "status" INTEGER NOT NULL,
      "public" BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("authorId") REFERENCES ${DATABASE_TABLE.USER}("id")
    )
  `);

  // Create Action table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.ACTION} (
      "id" SERIAL PRIMARY KEY,
      "jobId" INTEGER NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "order" INTEGER NOT NULL,
      "specificActionType" VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("jobId") REFERENCES ${DATABASE_TABLE.WORKFLOW}("id") ON DELETE CASCADE
    )
  `);

  // Create ActionInput table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.ACTION_INPUT} (
      "id" SERIAL PRIMARY KEY,
      "actionId" INTEGER NOT NULL,
      "valueFromInputId" INTEGER,
      "name" VARCHAR(255),
      "type" VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("actionId") REFERENCES ${DATABASE_TABLE.ACTION}("id") ON DELETE CASCADE,
      FOREIGN KEY ("valueFromInputId") REFERENCES ${DATABASE_TABLE.ACTION_INPUT}("id")
    )
  `);

  // Create ActionOutput table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.ACTION_OUTPUT} (
      "id" SERIAL PRIMARY KEY,
      "actionId" INTEGER NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "type" VARCHAR(255) NOT NULL,
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
