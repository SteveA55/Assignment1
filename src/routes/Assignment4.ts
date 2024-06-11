//import zodRouter from 'koa-zod-router';
import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
//const router = zodRouter();

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



// DUPLICATE DATA need to find a better way to do this.

console.log("^^^^^^^^ BOOK MONGOOSE ^^^^^^^^^^^", Book)

// Assignment 4. Find book by ID (lookupBookById)
export const lookupBookById = createRouteSpec({
    name: 'List all books.',
    method: 'get',
    path: '/booksAssignment4',
    handler: async (ctx, next) => {
        const { query } = ctx.request;

        // Fetch all books from MongoDB
        const result = await Book.find({ id: query.BookID });
        //const result = await Book.find({});

        // Display all books if fetch was successful.
        if (result) {
            console.log(`Fetching book with bookid: ${query.BookID} successful.`);
            ctx.response.body = { result }
        }
        else
            console.log(`Failed to fetch book by book id: ${query.BookID}.`);
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: z.object({
            BookID: z.coerce.number()
        }),
    },
});

// Assignment 4. (placeBooksOnShelf)
export const placeBooksOnShelf = createRouteSpec({
    name: 'List all books.',
    method: 'post',
    path: '/booksAssignment4/warehouse',
    handler: async (ctx, next) => {
        const { query } = ctx.request;

        // Fetch all books from MongoDB
        //const result = await Book.find({ id: query.id })

        const result = await Shelf.create({
            bookId: query.bookId,
            numberOfBooks: query.numberOfBooks,
            shelf: query.shelf
        })

        // List all shelves. Delete this later.
        const shelves = await Shelf.find({})

        console.log("--- SHELVES ---", shelves)

        // Display all books if fetch was successful.
        if (result) {
            const resp = `Shelf was created successfully id: ${query.bookId}`;
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            const resp = `Failed to create new shelf id: ${query.bookId}.`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },

    validate: {

        query: z.object({
            bookId: z.string(), numberOfBooks: z.coerce.number(),
            shelf: z.string()
        }),
    },

});

// Assignment 4. (orderBooks)
export const orderBooks = createRouteSpec({
    name: 'Orders books here.',
    method: 'get',
    path: '/booksAssignment4/createOrder',
    handler: async (ctx, next) => {
        const { query } = ctx.request;

        const result = await Orders.create({
            BookID: query.BookID,
            OrderId: query.OrderId
        })

        // Display all books if fetch was successful.
        if (result) {
            const resp = `Order was created successfully id: ${query.OrderId}`;
            console.log(resp);
            ctx.response.body = { resp }
        }
        else {
            const resp = `Failed to create new order id: ${query.OrderId}.`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },

    validate: {
        query: z.object({
            OrderId: z.string(),
            BookID: z.array(z.coerce.number()),
        }),
    },


});



// Assignment 4. (listOrders)
export const listOrders = createRouteSpec({
    name: 'List orders here.',
    method: 'get',
    path: '/booksAssignment4/orders',
    handler: async (ctx, next) => {
        // const { query } = ctx.request;

        // List all orders.
        const orders = await Orders.find({})

        console.log("--- ORDERS ---", orders)


        // Display all books if fetch was successful.
        if (orders) {
            const resp = `Orders successfully fetched.\n\n ${orders}`;
            console.log(resp);
            ctx.response.body = { ...orders }
        }
        else {
            const resp = `Failed to fetch orders.`
            console.log(resp);
            ctx.response.body = { ...orders }
        }
        await next();
    },
});





// Assignment 4. (findBookOnShelf)
export const findBookOnShelf = createRouteSpec({
    name: 'Find book on shelf here.',
    method: 'get',
    path: '/booksAssignment4/warehouse',
    handler: async (ctx, next) => {
        const { query } = ctx.request;

        const result = await Shelf.find({
            bookId: query.bookId,
        })

        // Display all books if fetch was successful.
        if (result) {
            const resp = `Book ${query.bookId} was found.`;
            console.log(resp);
            console.log(result)
            ctx.response.body = { resp, result }
        }
        else {
            const resp = `Failed to find the book: ${query.bookId}.`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },

    validate: {
        query: z.object({
            bookId: z.string(),
        }),
    },


});





// Assignment 4. (fulfillOrder)
export const fulfillOrder = createRouteSpec({
    name: 'Fulfil an order.',
    method: 'post',
    path: '/booksAssignment4/Fulfillorders',
    handler: async (ctx, next) => {
        const { query }: any = ctx.request;

        //var myquery: [{}] | any;

        // myquery = query;

        console.log("----------- query ---------", query);
        //console.log("query length", query.length);

        var result;

        if (query !== undefined && query !== null) {
            query?.map(async (oneElement: any) => {
                result = await Orders.create({
                    BookID: oneElement.BookID,
                    OrderId: oneElement.OrderId,
                    ShelfID: oneElement.ShelfID,
                    numberOfBooks: oneElement.numberOfBooks,
                })

            })
        }

        /*
        const result = await Orders.create({
            BookID: query.BookID,
            OrderId: query.OrderId,
            ShelfID: query.ShelfID,
            numberOfBooks: query.numberOfBooks
        })
*/
        // Display all books if fetch was successful.
        if (result) {
            const resp = `Order ${query.OrderId} was fulfilled.`;
            console.log(resp);
            console.log(result)
            ctx.response.body = { resp, result }
        }
        else {
            const resp = `Failed to fulfill the order: ${query.OrderId}.`
            console.log(resp);
            ctx.response.body = { resp }
        }
        await next();
    },
    /*
        validate: {
            query: z.object({
                OrderId: z.string(),
                BookID: z.array(z.coerce.number()),
                ShelfID: z.string(),
                numberOfBooks: z.coerce.number(),
            }),
        },
    */

});


//export default router;