'use strict';

module.exports = {
    secretKey: "coconutSecretKey2020",
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            database: 'master',
            user: 'postgres',
            password: 'root',
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
            user: 'te',
            password: 'password'
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
