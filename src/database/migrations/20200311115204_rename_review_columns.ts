import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('reviews', (table: Knex.TableBuilder) => {
    table.renameColumn('created_at', 'createdAt');
    table.renameColumn('last_updated_at', 'lastUpdatedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('reviews', (table: Knex.TableBuilder) => {
    table.renameColumn('createdAt', 'created_at');
    table.renameColumn('lastUpdatedAt', 'last_updated_at');
  });
}
