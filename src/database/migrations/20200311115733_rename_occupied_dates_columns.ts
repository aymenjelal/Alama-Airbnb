import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(
    'occupied_dates',
    (table: Knex.TableBuilder) => {
      table.renameColumn('book_date', 'bookDate');
      table.renameColumn('booking_date', 'bookingDate');
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(
    'occupied_dates',
    (table: Knex.TableBuilder) => {
      table.renameColumn('bookDate', 'book_date');
      table.renameColumn('bookingDate', 'booking_date');
    }
  );
}
