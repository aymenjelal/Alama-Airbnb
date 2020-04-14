import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('reviews', (table: Knex.TableBuilder) => {
    table.dropForeign(['listings_id']);
    table
      .foreign('listings_id')
      .references('listings.id')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('reviews', (table: Knex.TableBuilder) => {
    table.dropForeign(['listings_id']);
    table
      .foreign('listings_id')
      .references('listings.id')
      .onDelete('NO ACTION');
  });
}
