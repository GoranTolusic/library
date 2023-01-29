import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('borrowed_books', function (table) {
        table.bigIncrements('id');
        table.bigInteger('bookId').unsigned().references('id').inTable('books').onDelete('CASCADE');
        table.bigInteger('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.bigInteger('createdAt');
        table.bigInteger('updatedAt');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('borrowed_books')
}
