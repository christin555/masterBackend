'use strict';

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            database: 'production',
            user: 'postgres',
            password: '3133',
            port: '5432'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        useNullAsDefault: true
    },

    production: {
        client: 'pg',
        connection: {
            database: 'production',
            user: 'postgres',
            password: '3133'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        useNullAsDefault: true
    }
};
