import { Inject } from '@nestjs/common';
import { eq, Table } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import { PG_CONNECTION } from '@core/common/database/drizzle/pg-connection';
import { useDynamicSchema } from '@core/common/database/entities/helpers/use-dynamic-schema';

export class AbstractDao<TSchema extends Record<string, unknown>, Entity extends Table, InferEntitySelected, InferEntityInsert> {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: PostgresJsDatabase<TSchema>,
    private readonly entity: Entity,
    protected readonly dbConfig: DatabaseConfig,
  ) {}

  protected get useSchema() {
    return useDynamicSchema(this.entity, this.dbConfig.schemaName);
  }

  async getAll() {
    return this.db.select().from(this.useSchema).execute();
  }

  async getById(id: string, fieldsToSelect: (keyof Entity)[]): Promise<Partial<InferEntitySelected>[]> {
    const selectedFields = this.selectFields(fieldsToSelect);
    return this.db.select(selectedFields).from(this.useSchema).where(eq(this.entity['id'], id));
  }

  async getOneById(id: string, fieldsToSelect: (keyof Entity)[]): Promise<Partial<InferEntitySelected>> {
    const res = await this.getById(id, fieldsToSelect);
    return res && res.length > 0 ? res[0] : null;
  }

  async getBySingleKey(key: keyof Entity, value: any, fieldsToSelect: (keyof Entity)[]): Promise<Partial<InferEntitySelected>[]> {
    const selectedFields = this.selectFields(fieldsToSelect);
    return await this.db
      .select(selectedFields)
      .from(this.useSchema)
      .where(eq(this.entity[key as string], value))
      .execute();
  }

  async getOneBySingleKey(key: keyof Entity, value: any, fieldsToSelect: (keyof Entity)[]): Promise<Partial<InferEntitySelected>> {
    const bySingleKey = await this.getBySingleKey(key, value, fieldsToSelect);
    return bySingleKey && bySingleKey.length > 0 ? bySingleKey.at(-1) : null;
  }

  async insertNewRecord(entity: Partial<InferEntityInsert>): Promise<Partial<InferEntitySelected>> {
    const insertedRows = await this.db
      .insert(this.useSchema)
      .values(entity as InferEntityInsert)
      .returning()
      .execute();
    return Array.isArray(insertedRows) && insertedRows.length === 1 ? (insertedRows.at(-1) as Partial<InferEntitySelected>) : null;
  }

  async deleteById(id: string) {
    return this.db.delete(this.useSchema).where(eq(this.entity['id'], id)).returning().execute();
  }

  async updateById(id: string, fieldsToUpdate: Partial<InferEntityInsert>): Promise<Partial<InferEntitySelected>[]> {
    return (await this.db
      .update(this.useSchema)
      .set(fieldsToUpdate as InferEntityInsert)
      .where(eq(this.entity['id'], id))
      .returning()
      .execute()) as Partial<InferEntitySelected>[];
  }

  async deleteAll() {
    return this.db.delete(this.useSchema).execute();
  }

  private selectFields(fieldsToSelect: (keyof Entity)[]) {
    return fieldsToSelect.reduce((acc, fieldToSelect) => {
      acc[fieldToSelect as string] = this.entity[fieldToSelect];
      return acc;
    }, {});
  }
}
