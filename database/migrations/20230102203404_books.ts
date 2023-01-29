import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('books', function (table) {
        table.bigIncrements('id');
        table.string('title', 255).notNullable();
        table.text('content');
        table.string('publisher', 255);
        table.string('uid', 255).notNullable();
        table.bigInteger('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.bigInteger('createdAt');
        table.bigInteger('updatedAt');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('books')
}
