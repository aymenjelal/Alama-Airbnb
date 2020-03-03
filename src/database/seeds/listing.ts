import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('listings')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('users').del();
    })
    .then(() => {
      return knex('users').insert([
        {
          first_name: 'Aymen',
          last_name: 'J',
          email: 'aymen@gmail.com',
          password: 'test123',
          country: 'Ethiopia',
          street: '4k',
          phone: '0923704406',
          language: 'English',
          ishost: true,
          joined_date: new Date().toUTCString()
        },
        {
          first_name: 'Simret',
          last_name: 'A',
          email: 'simret@gmail.com',
          password: 'test123',
          country: 'Ethiopia',
          street: '4k',
          phone: '0923704406',
          language: 'English',
          ishost: true,
          joined_date: new Date().toUTCString()
        },
        {
          first_name: 'Nahoo',
          last_name: 'H',
          email: 'nahoo@gmail.com',
          password: 'test123',
          country: 'Ethiopia',
          street: '4k',
          phone: '0923704406',
          language: 'English',
          ishost: true,
          joined_date: new Date().toUTCString()
        }
      ]);
    })
    .then(() => {
      return knex('users')
        .pluck('id')
        .then(usersId => {
          return knex('listings').insert([
            {
              users_id: usersId[0],
              name: 'Aymens House',
              price: '150.00',
              street: '4kilo',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              bedrooms: 3,
              bathrooms: 2,
              person_capacity: 6,
              house_type: 'vila',
              rating: 3.5,
              created_at: new Date().toUTCString()
            },
            {
              users_id: usersId[1],
              name: 'Simrets House',
              price: '150.00',
              street: '4kilo',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              bedrooms: 3,
              bathrooms: 2,
              person_capacity: 6,
              house_type: 'vila',
              rating: 3.5,
              created_at: new Date().toUTCString()
            },
            {
              users_id: usersId[2],
              name: 'Nahoos House',
              price: '150.00',
              street: '4kilo',
              city: 'Addis Ababa',
              country: 'Ethiopia',
              bedrooms: 3,
              bathrooms: 2,
              person_capacity: 6,
              house_type: 'vila',
              rating: 3.5,
              created_at: new Date().toUTCString()
            }
          ]);
        });
    });
}
