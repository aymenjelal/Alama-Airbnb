import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('geolocations', (table: Knex.TableBuilder) => {
    table.renameColumn('log', 'long');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('geolocations', (table: Knex.TableBuilder) => {
    table.renameColumn('long', 'log');
  });
}
