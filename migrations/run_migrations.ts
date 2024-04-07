import { DatabaseConfig } from '@core/common/database/config/database.config';
import { DatabaseHelper } from '@core/common/database/helpers/database.helper';

async function runMigrations(): Promise<void> {
  const [connectionString, schemaName] = [DatabaseConfig.postgresqlConnection, DatabaseConfig.schemaName];
  await DatabaseHelper.runMigrations(`${__dirname}/src`, connectionString, schemaName);
}

void runMigrations();
