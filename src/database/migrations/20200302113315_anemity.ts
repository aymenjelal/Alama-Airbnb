import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('anemitys', (table: Knex.TableBuilder) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('listings_id').references('listings.id');
    table.string('name');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('anemitys');
}
