import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('listings', (table: Knex.TableBuilder) => {
    table.renameColumn('jcreatedAt', 'createdAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('listings', (table: Knex.TableBuilder) => {
    table.renameColumn('createdAt', 'jcreatedAt');
  });
}
