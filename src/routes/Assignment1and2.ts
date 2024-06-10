import zodRouter from 'koa-zod-router';
import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
const fs = require("fs");
const router = zodRouter();

const mongoose = require("mongoose");
import { Book } from "../models/books";
import { Orders } from "../models/orders";
import { Shelf } from "../models/shelf";

export type BookID = string;

const DB = "mongodb://mongo:27017";

mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err: string) => console.log("Mongoose DB connection error: ", err));

const books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));


// List all books with filters.
export const listBooks = createRouteSpec({
    name: 'List of books.',
    method: 'get',
    path: '/booksList',
    handler: async (ctx, next) => {
        const { query } = ctx.request;
        const filteredBooks: Array<object> = [];
        // Loop through all books and filters, only return the books that match the indicated filters.
        books?.map((book: object | any) => {
            // if (query.from && query.to != undefined)
            if (book.price <= query.to && book.price >= query.from) {
                filteredBooks.push(book);
            }
        })
        // Send back success result with only books that matched filters to the client.
        ctx.response.status = 200;
        ctx.response.body = { filteredBooks }
        //ctx.body = filteredBooks
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        //query: z.object({ from: z.optional(z.coerce.number()), to: z.optional(z.coerce.number()) }),
        query: z.object({ from: z.coerce.number(), to: z.coerce.number() }),
    },
});




