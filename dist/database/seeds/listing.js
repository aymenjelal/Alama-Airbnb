"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.seed = seed;
