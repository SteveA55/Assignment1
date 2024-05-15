import axios from "axios";
import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { array, isDirty, z } from 'zod';
import assignment1 from "../adapter/assignment-1";

import assignment2 from "../adapter/assignment-2";

const cors = require('@koa/cors');
const fs = require("fs");
const app = new Koa();
const router = zodRouter();

const mongoose = require("mongoose");


var books = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));



router.register({
    name: 'List of books.',
    method: 'get',
    path: '/booksList',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;
        // DEBUG
        //console.log("QUERY:::", query);
        //console.log("type of query::::", typeof (query.from));

        // Query is always of type string. We don't have control over that, so I wrote the following code which works. But it is not susitable for this use-case scenario because query would always be of type string, not set by us. But by the framework koa-zod-router I believe.
        /*
        if (typeof (query.from) != 'number' || typeof (query.to) == 'number') {
            var error: string = "Invalid input. From or To filter is not of type number. Needs to be of type number.";
            ctx.body = { error }
            throw new TypeError(error);
        }*/
        // We ended up not needing this as we figuered out how to use validate in zod.
        // Convert type string to type number.
        //var from: number = +`${query.from}`;
        //var to: number = +`${query.to}`;
        // DEBUG
        //console.log("PARAMS::::", params)
        //console.log("BODY:::", body);
        //console.log("HEADERS::::", headers)
        // Didn't need this as we now use validate in vod instead of our own validation.
        //var filteredBooks: Promise<object> = listBooks([{ "from": from, "to": to }]);
        var filteredBooks: Promise<object> = assignment1.listBooks(books, [{ "from": query.from, "to": query.to }]);

        // Send the filtered book list as json back to the user
        filteredBooks.then((value) => {
            // console.log("value:::::::::", value);
            ctx.response.body = { value }
        })
        // DEBUG
        //console.log("FILTERED BOOKS::::::::::", filteredBooks);
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: z.object({ from: z.coerce.number(), to: z.coerce.number() }),
    },
});

const DB = "mongodb://mongo:27017";

mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err: string) => console.log("Mongoose DB connection error: ", err));

console.log("HTTP METHOD\tURL\tAction(requirements)");
console.log("GET\t\t/books\t\tFetch All Books");
console.log("POST\t\t/books\t\tCreate new book (id, name, author, description, price, image required)");
console.log("PATCH\t\t/books\t\tUpdate a book by price (price required)");
console.log("DELETE\t\t/books\t\tDelete a book (id required)")

const Book = mongoose.model("Book", {
    id: { type: Number },
    name: { type: String },
    author: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
});

// List all books.
router.register({
    name: 'Create new book.',
    method: 'get',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.find({})

        // Delete this later. List all documents.
        console.log();

        if (result) {
            console.log(`Fetching document successful.`);
            ctx.response.body = { result }
        }
        else
            console.log("Failed to fetch database.");
        await next();
    }
});

// Create a book.
router.register({
    name: 'Create new book.',
    method: 'post',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;
        // const id: string = query.from.id;
        console.log("type of id,", typeof (query.id))
        console.log("Create new book. ID::::::.", query.id);
        console.log("Create new book. AUTHOR::::::.", query.author);

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.create({
            id: query.id,
            name: query.name,
            author: query.author,
            description: query.description,
            price: query.price,
            image: query.image
        })

        // Delete this later. List all documents.
        console.log(await Book.find({}));

        if (result)
            console.log(`Book created success ${query.id}:`);
        else
            console.log("Failed to create new book.");
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: assignment1.z.object({
            id: assignment1.z.coerce.number(), name: assignment1.z.string(),
            author: assignment1.z.string(), description: assignment1.z.string(),
            price: assignment1.z.coerce.number(), image: assignment1.z.string()
        }),
    },
});

// Update a book's price.
router.register({
    name: 'Update a book.',
    method: 'patch',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;
        // const id: string = query.from.id;
        console.log("type of id,", typeof (query.id))
        console.log("Create new book. ID::::::.", query.id);
        console.log("Create new book. AUTHOR::::::.", query.author);

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.findOneAndUpdate({ id: query.id }, { price: query.price })
        /*const doc = await Book.findById(query.id);
        doc.price = query.price;
        await doc.save();
*/
        // Delete this later. List all documents.
        console.log(await Book.find({}));

        if (result)
            console.log(`Book id ${query.id}, price has been adjusted to ${query.price}:`);
        else
            console.log("Failed to update book price.");

        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: assignment1.z.object({
            id: assignment1.z.coerce.number(),
            price: assignment1.z.coerce.number(),
        }),
    },
});

// Delete a book by id.
router.register({
    name: 'Delete a book.',
    method: 'delete',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.deleteOne({
            id: query.id
        })
        /*const doc = await Book.findById(query.id);
        doc.price = query.price;
        await doc.save();
*/
        // Delete this later. List all documents.
        console.log(await Book.find({}));

        if (result.deletedCount >= 1)
            console.log(`Book id ${query.id}, has been removed.:`);
        else
            console.log(`Failed to remove book (${query.id}).`);

        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: assignment1.z.object({
            id: assignment1.z.coerce.number()
        }),
    },
});



app.use(router.routes());

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

app.use(cors)