"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBooks = void 0;
const koa_zod_router_1 = require("koa-zod-router");
const zod_1 = require("zod");
const fs = require("fs");
const mongoose = require("mongoose");
// Set our mongoDB url to connect to.
const DB = "mongodb://mongo:27017";
// Connect to our mongoDB inside the dev container. Output the result and check if an error occured.
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err) => console.log("Mongoose DB connection error: ", err));
// This is the local file containing our list of books in JSON format for processing.
const books = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));
// List all books with filters.
exports.listBooks = (0, koa_zod_router_1.createRouteSpec)({
    name: 'List of books.',
    method: 'get',
    path: '/booksList',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        const filteredBooks = [];
        // Loop through all books and filters, only return the books that match the indicated filters.
        books?.map((book) => {
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
        });
        // Send back success result with only books that matched filters to the client.
        ctx.response.status = 200;
        ctx.response.body = { filteredBooks };
        //ctx.body = filteredBooks
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({ from: zod_1.z.optional(zod_1.z.coerce.number()), to: zod_1.z.optional(zod_1.z.coerce.number()) }),
    },
});
