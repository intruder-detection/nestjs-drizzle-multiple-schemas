import { Client } from 'pg';
import * as schema from '@core/common/database/entities/entities.schema';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';

export class DatabaseHelper {
  static async runMigrations(migrationsFolderPath: string, connectionString: string, schemaName: string): Promise<void> {
    const client = new Client({ connectionString });
    await client.connect();
    const db = drizzle(client, { schema });
    await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`));
    await db.execute(sql.raw(`SET schema '${schemaName}'`));
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, { migrationsFolder: migrationsFolderPath, migrationsSchema: schemaName });
    await client.end();
  }

  static async cleanSchema(connectionString: string, schemaName: string): Promise<void> {
    const client = new Client({ connectionString });
    await client.connect();
    const db = drizzle(client, { schema });
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`))
    await client.end();
  }
}
