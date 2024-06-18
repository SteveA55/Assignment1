"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fulfilOrder = exports.findBookOnShelf = exports.listOrders = exports.orderBooks = exports.placeBooksOnShelf = exports.lookupBookById = void 0;
const koa_zod_router_1 = require("koa-zod-router");
const zod_1 = require("zod");
const mongoose = require("mongoose");
// Import our mongoose document models.
const books_1 = require("../models/books");
const orders_1 = require("../models/orders");
const shelf_1 = require("../models/shelf");
// Set our mongoDB url to connect to.
const DB = "mongodb://mongo:27017";
// Connect to our mongoDB inside the dev container. Output the result and check if an error occured.
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err) => console.log("Mongoose DB connection error: ", err));
// Assignment 4. Find book by ID (lookupBookById)
exports.lookupBookById = (0, koa_zod_router_1.createRouteSpec)({
    name: 'List all books.',
    method: 'get',
    path: '/booksAssignment4',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        // Fetch a specific book by looking up its ID number.
        const result = await books_1.Book.find({ id: query.BookID });
        // Display the book by id, if fetch was successful.
        if (result) {
            console.log(`Fetching book with bookid: ${query.BookID} successful.`);
            ctx.response.body = { result };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else
            console.log(`Failed to fetch book by book id: ${query.BookID}.`);
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            BookID: zod_1.z.coerce.number()
        }),
    },
});
// Assignment 4. (placeBooksOnShelf)
exports.placeBooksOnShelf = (0, koa_zod_router_1.createRouteSpec)({
    name: 'List all books.',
    method: 'post',
    path: '/booksAssignment4/warehouse',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        // Create a new shelf and place the books on the corrosponding shelf.
        const result = await shelf_1.Shelf.create({
            bookId: query.bookId,
            numberOfBooks: query.numberOfBooks,
            shelf: query.shelf
        });
        // Display all books if fetch was successful.
        if (result) {
            const resp = `Shelf was created successfully id: ${query.bookId}`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to create new shelf id: ${query.bookId}.`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            bookId: zod_1.z.string(), numberOfBooks: zod_1.z.coerce.number(),
            shelf: zod_1.z.string()
        }),
    },
});
// Assignment 4. (orderBooks)
exports.orderBooks = (0, koa_zod_router_1.createRouteSpec)({
    name: 'Orders books here.',
    method: 'get',
    path: '/booksAssignment4/createOrder',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        const result = await orders_1.Orders.create({
            BookID: query.BookID,
            OrderId: query.OrderId
        });
        // Display all books if fetch was successful.
        if (result) {
            const resp = `Order was created successfully id: ${query.OrderId}`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to create new order id: ${query.OrderId}.`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            OrderId: zod_1.z.string(),
            BookID: zod_1.z.array(zod_1.z.coerce.number()),
        }),
    },
});
// Assignment 4. (listOrders)
exports.listOrders = (0, koa_zod_router_1.createRouteSpec)({
    name: 'List orders here.',
    method: 'get',
    path: '/booksAssignment4/orders',
    handler: async (ctx, next) => {
        // Fetch all orders.
        const orders = await orders_1.Orders.find({});
        // Display all orders if fetch was successful. Otherwise let the frontend know an error occured.
        if (orders) {
            const resp = `Orders successfully fetched.\n\n ${orders}`;
            console.log(resp);
            ctx.response.body = { ...orders };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to fetch orders.`;
            console.log(resp);
            ctx.response.body = { ...orders };
        }
        await next();
    },
});
// Assignment 4. (findBookOnShelf)
exports.findBookOnShelf = (0, koa_zod_router_1.createRouteSpec)({
    name: 'Find book on shelf here.',
    method: 'get',
    path: '/booksAssignment4/warehouse',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        // Search the shelf document by the provided book id.
        const result = await shelf_1.Shelf.find({
            bookId: query.bookId,
        });
        // Display all books if fetch was successful.
        if (result) {
            const resp = `Book ${query.bookId} was found.`;
            console.log(resp);
            console.log(result);
            ctx.response.body = { resp, result };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to find the book: ${query.bookId}.`;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    validate: {
        query: zod_1.z.object({
            bookId: zod_1.z.string(),
        }),
    },
});
// Assignment 4. (fulfilOrder)
exports.fulfilOrder = (0, koa_zod_router_1.createRouteSpec)({
    name: 'Fulfil an order.',
    method: 'get',
    path: '/booksAssignment4/Fulfilorders',
    handler: async (ctx, next) => {
        // Capture the provided query for processing.
        const { query } = ctx.request;
        var result;
        // Loop through the array from provided input. Create a new order based upon the provided params.
        if (query !== undefined && query !== null) {
            query?.booksFulfilled?.map(async (oneElement) => {
                result = await orders_1.Orders.create({
                    BookID: oneElement.BookID,
                    OrderId: oneElement.OrderId,
                    ShelfID: oneElement.ShelfId,
                    numberOfBooks: oneElement.numberOfBooks,
                });
            });
        }
        // Display the order, if the order was successful. Otherwise log the error that occured.
        if (result) {
            const resp = `Order ${query.OrderId} was fulfilled.`;
            console.log(resp);
            console.log(result);
            ctx.response.body = { resp, result };
        }
        // Catch any errors that may have occured and return the error back to the client.
        else {
            const resp = `Failed to fulfill the order: ` + query.booksFulfilled[0].OrderId;
            console.log(resp);
            ctx.response.body = { resp };
        }
        await next();
    },
    // Make sure we are working with the expected input. Input validation check.
    /*
       validate: {
           query: z.object({
               booksFulfilled: z.array(
                   z.object({
                       OrderId: z.string(),
                       BookID: z.coerce.number(),
                       ShelfId: z.string(),
                       numberOfBooks: z.coerce.number(),
                   }),
               ),
           }),
       },
    */
});
//export default router;
