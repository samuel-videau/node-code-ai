import { config } from 'dotenv';
import pg from 'pg';

import { DATABASE_TABLE } from '../types';

config();
const POSTGRES_URI = process.env.POSTGRES_URI;


const dbName = POSTGRES_URI.split('/').pop();
const defaultConnectionString = POSTGRES_URI.replace(`/${dbName}`, '');

let client = new pg.Client({ connectionString: defaultConnectionString });

export const seedDb = async (dropTables?: boolean): Promise<void> => {
  await client.connect();

  // Check if the target database exists
  const dbExistsResult = await client.query(`
    SELECT 1 FROM pg_database WHERE datname='${dbName}'
  `);
  if (dbExistsResult.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }

  await client.end();

  client = new pg.Client({ connectionString: POSTGRES_URI });

  await client.connect();

  if (dropTables) {
    for (const table of Object.keys(DATABASE_TABLE).values())
      await client.query(`DROP TABLE IF EXISTS ${DATABASE_TABLE[table]} CASCADE`);
  }


  await client.query(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE.USER} (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "phoneNumber" VARCHAR(32),
      "credits" BIGINT NOT NULL DEFAULT 5000000,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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
      "specificActionType" INTEGER NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("jobId") REFERENCES ${DATABASE_TABLE.WORKFLOW}("id") ON DELETE CASCADE
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
      "responseType" VARCHAR(255) NOT NULL,
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
