"use strict";
// Update with your config settings.
//require('ts-node/register');
//require('dotenv').config({ path: './.env' });
module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'Welcome1',
            database: 'airbnb_db'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'migrations'
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'migrations'
        }
    }
    // development: {
    //   client: "sqlite3",
    //   connection: {
    //     filename: "./dev.sqlite3"
    //   }
    // },
    // staging: {
    //   client: "postgresql",
    //   connection: {
    //     database: "my_db",
    //     user: "username",
    //     password: "password"
    //   },
    //   pool: {
    //     min: 2,
    //     max: 10
    //   },
    //   migrations: {
    //     tableName: "knex_migrations"
    //   }
    // },
    // production: {
    //   client: "postgresql",
    //   connection: {
    //     database: "my_db",
    //     user: "username",
    //     password: "password"
    //   },
    //   pool: {
    //     min: 2,
    //     max: 10
    //   },
    //   migrations: {
    //     tableName: "knex_migrations"
    //   }
    // }
};
