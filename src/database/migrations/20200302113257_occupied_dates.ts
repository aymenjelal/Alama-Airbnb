import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'occupied_dates',
    (table: Knex.TableBuilder) => {
      table
        .uuid('id')
        .unique()
        .notNullable()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('listings_id').references('listings.id');
      table.uuid('users_id').references('users.id');
      table.date('book_date');
      table.timestamp('booking_date');
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('occupied_dates');
}
