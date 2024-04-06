import { Table } from 'drizzle-orm';

/**
 * This is a helper method that allows us to use a specific schema to run our queries against. Any time you want to query from a specific schema
 * you just use it like:
 *
 * ```ts
 * db.select().from(useDynamicSchema(sourceEntity, 'schema_name')).execute()
 * ```
 * See abstract.dao for multiple examples of how the method can be used.
 *
 * See: https://github.com/drizzle-team/drizzle-orm/issues/423#issuecomment-2016750019
 */
export const useDynamicSchema = <T extends Table>(table: T, schema: string): T => {
  // @ts-expect-error Symbol is @internal in drizzle-orm, see https://github.com/drizzle-team/drizzle-orm/blob/0.30.4/drizzle-orm/src/table.ts#L64-L65
  table[Table.Symbol.Schema] = schema;
  return table;
};
