//import zodRouter from 'koa-zod-router';
import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
const fs = require("fs");
//const router = zodRouter();

const mongoose = require("mongoose");
import { Book } from "../models/books";
//import { Orders } from "../models/orders";
//import { Shelf } from "../models/shelf";

export type BookID = string;

const DB = "mongodb://mongo:27017";

mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err: string) => console.log("Mongoose DB connection error: ", err));

const books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));


// List all books with multiple filters (Assignment 3)
export const listBooksMultipleFilters = createRouteSpec({
    name: 'List of books.',
    method: 'get',
    path: '/booksFilters',
    handler: async (ctx, next) => {
        const { query } = ctx.request;
        const filteredBooks: Array<object> = [];
        let howManyFilters: string | any = query.howManyFilters as string;
        let howManyFiltersCorrect: number = 0;
        // Make sure from and to are not counted as individual filters.
        if (query.from || query.to)
            howManyFilters = Object.keys(query).length - 1;
        else if (howManyFilters === query.name || query.author)
            howManyFilters = Object.keys(query).length;
        // Loop through all books and filters, only return the books that match ALL filters.
        books?.map((book: object | any) => {
            if (query.from != undefined && query.to != undefined && book.price <= query.to && book.price >= query.from)
                howManyFiltersCorrect++;
            if (query.name != undefined && query.name === book.name)
                howManyFiltersCorrect++;
            if (query.author != undefined && query.author === book.author)
                howManyFiltersCorrect++;
            if (howManyFiltersCorrect >= parseInt(howManyFilters))
                filteredBooks.push(book);
            howManyFiltersCorrect = 0;
        })
        // Reset the counter.
        howManyFilters == 0;
        // Send success response back to client
        ctx.response.status = 200;

        ctx.body = { ...filteredBooks }
        //ctx.response.body = { filteredBooks }
        // ctx.response.body = { books }
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with proper types such as numbers and strings.
        query: z.object({
            from: z.optional(z.coerce.number()), to: z.optional(z.coerce.number()),
            name: z.optional(z.string()), author: z.optional(z.string().optional())
        }),
    },
});
// Create a book.
export const createBook = createRouteSpec({
    name: 'Create new book.',
    method: 'post',
    path: '/books',
    handler: async (ctx, next) => {
        const { query } = ctx.request;
        // Create the new book in mongoDB with supplied parameters.
        const result = await Book.create({
            id: query.id,
            name: query.name,
            author: query.author,
            description: query.description,
            price: query.price,
            image: query.image
        })
        // Check if we successed in creating a new book or not.
        if (result) {
            const resp = `Book was created successfully id: ${query.id}`;
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            const resp = `Failed to create new book id: ${query.id}.`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: z.object({
            // id: z.coerce.number(), name: z.string(),
            name: z.string(),
            author: z.string(), description: z.string(),
            price: z.coerce.number(), image: z.string()
        }),
    },
});
// Update a book's price.
export const updateBook = createRouteSpec({
    name: 'Update a book.',
    method: 'patch',
    path: '/books',
    handler: async (ctx, next) => {
        const { query } = ctx.request;
        const result = await Book.findOneAndUpdate({ id: query.id }, { price: query.price })
        // Check if we were successful in updating a book by price or not.
        if (result) {
            const resp = `Book id ${query.id}, price has been adjusted to ${query.price}:`
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            const resp = `Failed to update book by price.`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: z.object({
            id: z.coerce.number(),
            price: z.coerce.number(),
        }),
    },
});
// Delete a book by id.
export const deleteBook = createRouteSpec({
    name: 'Delete a book.',
    method: 'delete',
    path: '/books',
    handler: async (ctx, next) => {
        const { query } = ctx.request;
        // Delete the book by id.
        const result = await Book.deleteOne({
            id: query.id
        })
        // Check if we successed in deleting book by id.
        if (result.deletedCount >= 1) {
            const resp = `Book id ${query.id}, has been removed.:`
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            const resp = `Failed to remove book (${query.id}).`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: z.object({
            id: z.coerce.number()
        }),
    },
});