"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.listBooksMultipleFilters = void 0;
const koa_zod_router_1 = require("koa-zod-router");
const zod_1 = require("zod");
const fs = require("fs");
const mongoose = require("mongoose");
// Import our mongoose document models.
const books_1 = require("../models/books");
// Set our mongoDB url to connect to.
const DB = "mongodb://mongo:27017";
// Connect to our mongoDB inside the dev container. Output the result and check if an error occured.
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err) => console.log("Mongoose DB connection error: ", err));
// This is the local file containing our list of books in JSON format for processing.
const books = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));
// List all books with multiple filters (Assignment 3)
exports.listBooksMultipleFilters = (0, koa_zod_router_1.createRouteSpec)({
    name: 'List of books.',
    method: 'get',
    path: '/booksFilters',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        const filteredBooks = [];
        // Set how many filters were supplied. Use string for compatiable with query types.
        let howManyFilters = query.howManyFilters;
        // Set the number of filters which are correct to a default value of none.
        let howManyFiltersCorrect = 0;
        // Make sure from and to are not counted as individual filters but one combined filter.
        if (query.from || query.to)
            howManyFilters = Object.keys(query).length - 1;
        else if (howManyFilters === query.name || query.author)
            howManyFilters = Object.keys(query).length;
        // Loop through all books and filters, only return the books that match ALL filters.
        books?.map((book) => {
            if (query.from != undefined && query.to != undefined && book.price <= query.to && book.price >= query.from)
                howManyFiltersCorrect++;
            if (query.name != undefined && query.name === book.name)
                howManyFiltersCorrect++;
            if (query.author != undefined && query.author === book.author)
                howManyFiltersCorrect++;
            if (howManyFiltersCorrect >= parseInt(howManyFilters))
                filteredBooks.push(book);
            howManyFiltersCorrect = 0;
        });
        // Reset the counter.
        howManyFilters == 0;
        // Send success response back to client
        ctx.response.status = 200;
        // Deconstruct the object for better returning of the expected results.
        ctx.body = { ...filteredBooks };
        //ctx.response.body = { filteredBooks }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            from: zod_1.z.optional(zod_1.z.coerce.number()), to: zod_1.z.optional(zod_1.z.coerce.number()),
            name: zod_1.z.optional(zod_1.z.string()), author: zod_1.z.optional(zod_1.z.string().optional())
        }),
    },
});
// Create a book.
exports.createBook = (0, koa_zod_router_1.createRouteSpec)({
    name: 'Create new book.',
    method: 'post',
    path: '/books',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        // Create the new book in mongoDB with supplied parameters.
        const result = await books_1.Book.create({
            id: query.id,
            name: query.name,
            author: query.author,
            description: query.description,
            price: query.price,
            image: query.image
        });
        // Check if we successed in creating a new book or not.
        if (result) {
            const resp = `Book was created successfully id: ${query.id}`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to create new book id: ${query.id}.`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            // id: z.coerce.number(), name: z.string(),
            name: zod_1.z.string(),
            author: zod_1.z.string(), description: zod_1.z.string(),
            price: zod_1.z.coerce.number(), image: zod_1.z.string()
        }),
    },
});
// Update a book's price.
exports.updateBook = (0, koa_zod_router_1.createRouteSpec)({
    name: 'Update a book.',
    method: 'patch',
    path: '/books',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        // Find a book by ID in the mongoose DB and update the price with the provided new price parameter.
        const result = await books_1.Book.findOneAndUpdate({ id: query.id }, { price: query.price });
        // Check if we were successful in updating a book by price or not.
        if (result) {
            const resp = `Book id ${query.id}, price has been adjusted to ${query.price}:`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to update book by price.`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            id: zod_1.z.coerce.number(),
            price: zod_1.z.coerce.number(),
        }),
    },
});
// Delete a book by id.
exports.deleteBook = (0, koa_zod_router_1.createRouteSpec)({
    name: 'Delete a book.',
    method: 'delete',
    path: '/books',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        // Delete the book by the provided id parameter.
        const result = await books_1.Book.deleteOne({
            id: query.id
        });
        // Check if we successed in deleting book by id.
        if (result.deletedCount >= 1) {
            const resp = `Book id ${query.id}, has been removed.:`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to remove book (${query.id}).`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            id: zod_1.z.coerce.number()
        }),
    },
});
