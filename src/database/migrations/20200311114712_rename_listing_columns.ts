import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('listings', (table: Knex.TableBuilder) => {
    table.renameColumn('person_capacity', 'personCapacity');
    table.renameColumn('house_type', 'houseType');
    table.renameColumn('created_at', 'jcreatedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('listings', (table: Knex.TableBuilder) => {
    table.renameColumn('personCapacity', 'person_capacity');
    table.renameColumn('houseType', 'house_type');
    table.renameColumn('createdAt', 'jcreated_at');
  });
}
