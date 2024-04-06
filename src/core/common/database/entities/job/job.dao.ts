import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import { PG_CONNECTION } from '@core/common/database/drizzle/pg-connection';
import { AbstractDao } from '@core/common/database/entities/abstract.dao';
import * as jobsSchema from '@core/common/database/entities/job/job.entity';
import { JobEntity, JobEntityInsert, jobs } from '@core/common/database/entities/job/job.entity';

@Injectable()
export class JobDao extends AbstractDao<typeof jobsSchema, typeof jobs, JobEntity, JobEntityInsert> {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: PostgresJsDatabase<typeof jobsSchema>,
    protected readonly dbConfig: DatabaseConfig,
  ) {
    super(db, jobs, dbConfig);
  }
}
