import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('listings', (table: Knex.TableBuilder) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('users_id').references('users.id');
    table.string('name');
    table.decimal('price');
    table.string('street');
    table.string('city');
    table.string('country');
    table.integer('bedrooms');
    table.integer('bathrooms');
    table.integer('person_capacity');
    table.string('house_type');
    table.float('rating');
    table.timestamp('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('listings');
}
