//import axios from "axios";
import Koa from 'koa';
import zodRouter from 'koa-zod-router';
//import { array,isDirty, z } from 'zod';
import { z } from 'zod';
//import assignment1 from "../adapter/assignment-1";
import assignment2 from "../adapter/assignment-2";

const cors = require('@koa/cors');
const fs = require("fs");
const app = new Koa();
const router = zodRouter();

const mongoose = require("mongoose");

app.use(cors())

const books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));

//console.log("Assignment1,,,,,,,,", assignment1)
export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

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

// List all books with filters.
router.register({
    name: 'List of books.',
    method: 'get',
    path: '/booksList',
    handler: async (ctx, next) => {
        // const { body, headers, query, params } = ctx.request;
        const { query } = ctx.request;

        const filteredBooks: Array<object> = [];
        //if (query === undefined) { return; }

        // Loop through all books and filters, only return the books that match the indicated filters.
        books?.map((book: object | any) => {

            if (book.price <= query.to && book.price >= query.from) {
                filteredBooks.push(book);
                //book.display = true;
            }
        })

        ctx.response.status = 200;
        ctx.response.body = { filteredBooks }

        /* Un-used code we may want to revisit later.
                ctx.response.body = { books }
                ctx.response.body = { ...filteredBooks }
                console.log("----- Sending back filteredBooks list-----------");
                 return filteredBooks;
       */


        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: z.object({ from: z.coerce.number(), to: z.coerce.number() }),
    },
});

// List all books without filters.
router.register({
    name: 'List all books.',
    method: 'get',
    path: '/books',
    handler: async (ctx, next) => {
        //const { body, headers, query, params } = ctx.request;

        // Fetch all books from MongoDB
        const result = await Book.find({})

        // Display all books if fetch was successful.
        if (result) {
            console.log(`Fetching document successful.`);
            ctx.response.body = { result }
        }
        else
            console.log("Failed to fetch document in database.");
        await next();
    }
});

// List all books with multiple filters (Assignment 3)
router.register({
    name: 'List of books.',
    method: 'get',
    path: '/booksFilters',
    handler: async (ctx, next) => {

        const { query } = ctx.request;

        const filteredBooks: Array<object> = [];

        var howManyFilters: string | any = query.howManyFilters as string;
        var howManyFiltersCorrect: number = 0;

        console.log("how many keys............", Object.keys(query).length)

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

            //console.log("------COMPARISON---------", parseInt(howManyFilters), ":", howManyFiltersCorrect)

            if (howManyFiltersCorrect >= parseInt(howManyFilters))
                filteredBooks.push(book);

            howManyFiltersCorrect = 0;
        })

        // Reset the counter.
        howManyFilters == 0;

        // Send success response back to client
        ctx.response.status = 200;
        ctx.response.body = { filteredBooks }

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
router.register({
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
router.register({
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
router.register({
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

// Assignment 3



app.use(router.routes());

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

app.use(cors)



/* Un-needed code - we may want to re-introduce later. - Assignment 1 - fetch all books
        // Query is always of type string. We don't have control over that, so I wrote the following code which works. But it is not susitable for this use-case scenario because query would always be of type string, not set by us. But by the framework koa-zod-router I believe.
        
        if (typeof (query.from) != 'number' || typeof (query.to) == 'number') {
            var error: string = "Invalid input. From or To filter is not of type number. Needs to be of type number.";
            ctx.body = { error }
            throw new TypeError(error);
        }

         We ended up not needing this as we figuered out how to use validate in zod.
         Convert type string to type number.
        var from: number = +`${query.from}`;
        var to: number = +`${query.to}`;

         DEBUG
            console.log("PARAMS::::", params)
            console.log("BODY:::", body);
            console.log("HEADERS::::", headers)

         Didn't need this as we now use validate in vod instead of our own validation.
        var filteredBooks: Promise<object> = listBooks([{ "from": from, "to": to }]);
        var filteredBooks: Promise<object> = assignment1.listBooks(books, [{ "from": query.from, "to": query.to }]);
        var filteredBooks: Promise<object> = assignment2.listBooks([{ "from": query.from, "to": query.to }]);

        --- Inside books.map ---
              if (typeof (query) === "object") {
              if (query != undefined) { ; 
             query?.map((filter: object | any) => {
            DEBUG
                console.log("FROM::::::::", filter.from, "TO:::::::", filter.to);
                console.log("CURRENT BOOOK...........", book);
            Check the current book if it matches the current filter, if so, push that book onto array.

                        
            for (const key in filteredBooks) {
             
                console.log("value", filteredBooks[key]);
            }
        ---- After books.map -----
        console.log("DISPLAY............", books?.display)
        
        filteredBooks.map((book) => {
            console.log("BOOOOOOOOOOOOOOOOK", book)
        })
        
*/
