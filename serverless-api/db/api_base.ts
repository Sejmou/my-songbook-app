import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// I you find a cleaner way to validate environment variables, please let me know!
type EnvironmentVariables = {
  GENIUS_ACCESS_TOKEN: string;
  DATABASE_URL: string;
  SECRET_KEY: string;
};
const expectedEnvVars = [
  'GENIUS_ACCESS_TOKEN',
  'DATABASE_URL',
  'SECRET_KEY',
] as const;

function validateEnvironmentVariables(): void {
  const missingVars = expectedEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
}

validateEnvironmentVariables();

function createEnvObject(): EnvironmentVariables {
  return expectedEnvVars.reduce(
    (acc, envVar) => ({ ...acc, [envVar]: process.env[envVar] }),
    {} as EnvironmentVariables
  );
}

export const env: EnvironmentVariables = createEnvObject();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
