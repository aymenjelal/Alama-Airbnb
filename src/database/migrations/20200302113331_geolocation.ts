import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('geolocations', (table: Knex.TableBuilder) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('listings_id').references('listings.id');
    table.float('lat', 14, 10);
    table.float('log', 14, 10);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('geolocations');
}
