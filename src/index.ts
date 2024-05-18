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

app.use(cors())

var books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));

//console.log("Assignment1,,,,,,,,", assignment1)





// Assignment 1
router.register({
    name: 'List of books.',
    method: 'get',
    path: '/booksList',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;

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
        //var filteredBooks: Promise<object> = assignment1.listBooks(books, [{ "from": query.from, "to": query.to }]);
        //var filteredBooks: Promise<object> = assignment2.listBooks([{ "from": query.from, "to": query.to }]);

        var filteredBooks: Array<object> = [];
        //if (query === undefined) { return; }

        // Loop through all books and filters, only return the books that match the indicated filters.
        books?.map((book: object | any) => {

            // if (typeof (query) === "object") {
            //  if (query != undefined) { ; 
            // query?.map((filter: object | any) => {
            // DEBUG
            //console.log("FROM::::::::", filter.from, "TO:::::::", filter.to);
            //console.log("CURRENT BOOOK...........", book);
            // Check the current book if it matches the current filter, if so, push that book onto array.
            if (book.price <= query.to && book.price >= query.from) {
                //console.log("A MATCH:::::", book.price);
                filteredBooks.push(book);
                //book.display = true;
            }
            /*
            for (const key in filteredBooks) {
             
                console.log("value", filteredBooks[key]);
            }*/
        })

        //console.log("DISPLAY............", books?.display)
        /*
        filteredBooks.map((book) => {
            console.log("BOOOOOOOOOOOOOOOOK", book)
        })
        */
        ctx.response.status = 200;
        ///ctx.response.body = { books }
        //ctx.response.body = { ...filteredBooks }
        ctx.response.body = { filteredBooks }

        //return filteredBooks;
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
    name: 'List all books.',
    method: 'get',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.find({})

        if (result) {
            console.log(`Fetching document successful.`);
            ctx.response.body = { result }
        }
        else
            console.log("Failed to fetch document in database.");
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
        /*
        console.log("..........DEBUG - CREATE NEW BOOK RECEIVED..........");
        console.log("..........DEBUG - CREATE NEW BOOK RECEIVED..........");
        console.log("..........DEBUG - CREATE NEW BOOK RECEIVED..........");
        */

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.create({
            // id: query.id,
            name: query.name,
            author: query.author,
            description: query.description,
            price: query.price,
            image: query.image
        })

        // List all documents.
        //console.log(await Book.find({}));

        if (result) {
            let resp = `Book was created successfully id: ${query.id}`;
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            let resp = `Failed to create new book id: ${query.id}.`
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
router.register({
    name: 'Update a book.',
    method: 'patch',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;
        // const id: string = query.from.id;

        /* books?.map((book: object | any) => {
         assignment2.createOrUpdateBook(book);
         });*/

        var result = await Book.findOneAndUpdate({ id: query.id }, { price: query.price })

        /*const doc = await Book.findById(query.id);
        doc.price = query.price;
        await doc.save();
*/
        // List all documents.
        //console.log(await Book.find({}));

        if (result) {
            let resp = `Book id ${query.id}, price has been adjusted to ${query.price}:`
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            let resp = `Failed to update book by price.`
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

        // List all documents.
        //console.log(await Book.find({}));

        if (result.deletedCount >= 1) {
            let resp = `Book id ${query.id}, has been removed.:`
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            let resp = `Failed to remove book (${query.id}).`
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



app.use(router.routes());

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

app.use(cors)