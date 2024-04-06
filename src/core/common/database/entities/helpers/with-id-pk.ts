import { sql } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';

export const WithIdPk = {
  id: uuid('id')
    .primaryKey()
    // NOTICE: No need to add uuid-ossp since PostgreSQL now has gen_random_uuid
    .default(sql`gen_random_uuid()`),
};
