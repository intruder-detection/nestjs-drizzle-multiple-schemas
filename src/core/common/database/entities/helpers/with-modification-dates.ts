import { sql } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';

export const WithModificationDates = {
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdateFn(() => new Date()),
};
