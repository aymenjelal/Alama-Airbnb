import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('reviews', (table: Knex.TableBuilder) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('listings_id').references('listings.id');
    table.uuid('users_id').references('users.id');
    table.string('content');
    table.timestamp('created_at');
    table.timestamp('last_updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('reviews');
}
