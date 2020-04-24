import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('bookings', (table: Knex.TableBuilder) => {
    table.boolean('paid').defaultTo('false');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('bookings', (table: Knex.TableBuilder) => {
    table.dropColumn('paid');
  });
}
