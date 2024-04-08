import { INestApplication, Type } from '@nestjs/common';
import { TestUtils } from '@test/utils/test.utils';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import { DatabaseHelper } from '@core/common/database/helpers/database.helper';
import { DatabaseModule } from '@core/common/database/database.module';

describe('Multiple schemas', () => {
  let app1: INestApplication;
  let app2: INestApplication;

  beforeAll(async () => {
    app1 = await TestUtils.setupHttpContextApplication([DatabaseModule], 'schema1');
    app2 = await TestUtils.setupHttpContextApplication([DatabaseModule], 'schema2');
  });

  function getAppConfig(app: INestApplication): [string, string] {
    const dbConfig = app.get(DatabaseConfig);
    return [dbConfig.postgresqlConnection, dbConfig.schemaName];
  }

  it('created two schemas', async () => {
    expect(await DatabaseHelper.hasSchema(...getAppConfig(app1))).toBe(true);
    expect(await DatabaseHelper.hasSchema(...getAppConfig(app2))).toBe(true);

    const connectionString = DatabaseConfig.postgresqlConnection;
    expect(await DatabaseHelper.hasSchema(connectionString, 'schema1')).toBe(true);
    expect(await DatabaseHelper.hasSchema(connectionString, 'schema2')).toBe(true);
  });

  describe('another schema', () => {
    it('should not exist if not yet created', async () => {
      const connectionString = DatabaseConfig.postgresqlConnection;
      expect(await DatabaseHelper.hasSchema(connectionString, 'schemaaijadjsodsjodsjosdajoidsajdsajoi')).toBe(false);
    });

    it('should exist after being created', async () => {
      await TestUtils.setupHttpContextApplication([DatabaseModule], 'schemaaijadjsodsjodsjosdajoidsajdsajoi');
      const connectionString = DatabaseConfig.postgresqlConnection;
      expect(await DatabaseHelper.hasSchema(connectionString, 'schemaaijadjsodsjodsjosdajoidsajdsajoi')).toBe(true);
    });
  })
});
