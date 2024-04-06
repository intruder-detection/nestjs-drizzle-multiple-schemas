import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { Client } from 'pg';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import * as schema from '@core/common/database/entities/entities.schema';

async function migrateIntruderDetection(): Promise<void> {
  const client = new Client({
    connectionString: DatabaseConfig.postgresqlConnection,
  });
  await client.connect();
  const db = drizzle(client, { schema });
  // Makes sure the connection uses the Schema we want
  const schemaName = DatabaseConfig.schemaName;
  await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  await client.query(`SET schema '${schemaName}'`);
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: `${__dirname}/src`, migrationsSchema: schemaName });
  await client.end();
}

void migrateIntruderDetection();
