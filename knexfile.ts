require('dotenv').config();
import type { Knex } from "knex";

const dbCredentials = {
  host : process.env.DB_HOST,
  port : parseInt(process.env.DB_PORT),
  user : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
}


const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CONNECTION,
    connection: dbCredentials,
    seeds : {
      directory: './database/seeds',
      extension: 'ts'
    },
    migrations : {
      directory : 'database/migrations',
      extension: 'ts'
    }
  },

  staging: {
    client: process.env.DB_CONNECTION,
    connection: dbCredentials,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: process.env.DB_CONNECTION,
    connection: dbCredentials,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
