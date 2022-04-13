'use strict';

module.exports = {
    secretKey: "coconutSecretKey2022",
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            database: 'master',
            user: 'postgres',
            password: '3133',
            port: '5433'
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
            database: 'master',
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
