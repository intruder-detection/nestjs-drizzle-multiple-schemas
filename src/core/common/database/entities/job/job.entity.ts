import { index, pgTable, varchar } from 'drizzle-orm/pg-core';
import { WithIdPk } from '@core/common/database/entities/helpers/with-id-pk';
import { WithModificationDates } from '@core/common/database/entities/helpers/with-modification-dates';

export const jobs = pgTable(
  'jobs',
  {
    ...WithIdPk,
    fullName: varchar('full_name', { length: 256 }),
    ...WithModificationDates,
  },
  (users) => ({
    nameIdx: index('name_idx').on(users.fullName),
  }),
);

export type JobEntity = typeof jobs.$inferSelect;
