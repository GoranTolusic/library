import { Knex } from "knex";
import * as bcrypt from 'bcrypt';
require('dotenv').config();

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();

    const salt = await bcrypt.genSalt();
    let testUsers = [
        {
            firstName: "Marko",
            lastName: "Marković",
            email: "marko@mail.com",
            role: 'author',
            password: await bcrypt.hash('marko1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true
        },
        {
            firstName: "Pero",
            lastName: "Perić",
            email: "pero@mail.com",
            role: 'user',
            password: await bcrypt.hash('pero1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true
        },
        {
            firstName: "Antun",
            lastName: "Antunović",
            email: "antun@mail.com",
            role: 'user',
            password: await bcrypt.hash('antun1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: false
        },
        {
            firstName: "Main",
            lastName: "Admin",
            email: process.env.ADMIN_EMAIL || "goran@mail.com",
            role: 'admin',
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'goran1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true
        }
    ]

    await knex("users").insert(testUsers);
};
