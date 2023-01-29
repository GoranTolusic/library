import { Knex } from "knex";
require('dotenv').config();

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function (table) {
        table.bigIncrements('id');
        table.string('firstName', 255);
        table.string('lastName', 255);
        table.string('email', 255).unique().notNullable();
        table.string('password', 255).notNullable();
        table.enum('role', ['admin', 'author', 'user']).defaultTo('author');
        table.bigInteger('createdAt');
        table.bigInteger('updatedAt');
        table.boolean('active').defaultTo('active');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users')
}

