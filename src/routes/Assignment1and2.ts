import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';

const fs = require("fs");

const mongoose = require("mongoose");

export type BookID = string;

// Set our mongoDB url to connect to.
const DB = "mongodb://mongo:27017";

// Connect to our mongoDB inside the dev container. Output the result and check if an error occured.
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err: string) => console.log("Mongoose DB connection error: ", err));

// This is the local file containing our list of books in JSON format for processing.
const books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));


// List all books with filters.
export const listBooks = createRouteSpec({

    name: 'List of books.',
    method: 'get',
    path: '/booksList',

    handler: async (ctx, next) => {

        // Capture the provided query for processing.
        const { query } = ctx.request;

        const filteredBooks: Array<object> = [];

        // Loop through all books and filters, only return the books that match the indicated filters.
        books?.map((book: object | any) => {
            if (query.from && query.to) {
                if (book.price <= query.to && book.price >= query.from) {
                    filteredBooks.push(book);
                }
            }
            else if (query.from && query.to == undefined) {
                if (book.price <= query.from) {
                    filteredBooks.push(book);
                }
            }
            else if (query.to && query.from == undefined) {
                if (book.price >= query.to) {
                    filteredBooks.push(book);
                }
            }

        })

        // Send back success result with only books that matched filters to the client.
        ctx.response.status = 200;
        ctx.response.body = { filteredBooks }
        //ctx.body = filteredBooks

        await next();

    },

    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: z.object({ from: z.optional(z.coerce.number()), to: z.optional(z.coerce.number()) }),
    },

});




