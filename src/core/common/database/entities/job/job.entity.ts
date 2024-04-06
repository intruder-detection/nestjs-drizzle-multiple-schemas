import { index, pgTable, varchar } from 'drizzle-orm/pg-core';
import { WithIdPk } from '@core/common/database/entities/helpers/with-id-pk';
import { WithModificationDates } from '@core/common/database/entities/helpers/with-modification-dates';

export const jobs = pgTable(
  'jobs',
  {
    ...WithIdPk,
    name: varchar('name', { length: 256 }),
    ...WithModificationDates,
  },
  (jobs) => ({
    nameIdx: index('name_idx').on(jobs.name),
  }),
);

export type JobEntity = typeof jobs.$inferSelect;
export type JobEntityInsert = typeof jobs.$inferInsert;
