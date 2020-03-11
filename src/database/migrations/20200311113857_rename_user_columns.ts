import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table: Knex.TableBuilder) => {
    table.renameColumn('first_name', 'firstName');
    table.renameColumn('last_name', 'lastName');
    table.renameColumn('joined_date', 'joinedDate');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table: Knex.TableBuilder) => {
    table.renameColumn('firstName', 'first_name');
    table.renameColumn('lastName', 'last_name');
    table.renameColumn('joinedDate', 'joined_date');
  });
}
