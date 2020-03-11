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
          firstName: 'Aymen',
          lastName: 'J',
          email: 'aymen@gmail.com',
          password: 'test123',
          country: 'Ethiopia',
          street: '4k',
          phone: '0923704406',
          language: 'English',
          ishost: true,
          joinedDate: new Date().toUTCString()
        },
        {
          firstName: 'Simret',
          lastName: 'A',
          email: 'simret@gmail.com',
          password: 'test123',
          country: 'Ethiopia',
          street: '4k',
          phone: '0923704406',
          language: 'English',
          ishost: true,
          joinedDate: new Date().toUTCString()
        },
        {
          firstName: 'Nahoo',
          lastName: 'H',
          email: 'nahoo@gmail.com',
          password: 'test123',
          country: 'Ethiopia',
          street: '4k',
          phone: '0923704406',
          language: 'English',
          ishost: true,
          joinedDate: new Date().toUTCString()
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
              personCapacity: 6,
              houseType: 'vila',
              rating: 3.5,
              createdAt: new Date().toUTCString()
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
              personCapacity: 6,
              houseType: 'vila',
              rating: 3.5,
              createdAt: new Date().toUTCString()
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
              personCapacity: 6,
              houseType: 'vila',
              rating: 3.5,
              createdAt: new Date().toUTCString()
            }
          ]);
        });
    });
}
