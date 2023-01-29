import { Knex } from "knex";
import { uid } from 'uid';

export async function seed(knex: Knex): Promise<void> {
    await knex("books").del()

    let bookCounter = 0
    let testBooks = (await knex('users').select('id')).map((item) => {
        bookCounter++
        return {
            title : 'title ' + bookCounter,
            content: 'Some random content # ' + bookCounter,
            publisher: 'publisher ' + bookCounter,
            uid: uid(),
            userId: item.id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    })

    if (testBooks.length) await knex("books").insert(testBooks);
};
