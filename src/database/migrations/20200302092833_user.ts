import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name').notNullable;
    table.string('last_name').notNullable;
    table.string('email').notNullable;
    table.string('country');
    table.string('street');
    table.string('phone');
    table.string('language');
    table.boolean('ishost');
    table.timestamp('joined_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
