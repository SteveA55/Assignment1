import Koa from 'koa';
import zodRouter from 'koa-zod-router';

import { } from 'zod';
//import assignment1 from "../adapter/assignment-1";
//import assignment2 from "../adapter/assignment-2";
import { } from 'mongoose';

// Import our routes from previous assignments in a more organized manner.
import { listBooks } from './routes/Assignment1and2';
import { listBooksMultipleFilters, createBook, updateBook, deleteBook, } from './routes/Assignment3';
import { lookupBookById, placeBooksOnShelf, orderBooks, listOrders, findBookOnShelf, fulfilOrder } from './routes/Assignment4';

const cors = require('@koa/cors');
const app = new Koa();
const router = zodRouter();

const mongoose = require("mongoose");

/* Assignment 1 & 2 */
router.register(listBooks);

/* Assignment 3 */
router.register(listBooksMultipleFilters);
router.register(createBook);
router.register(updateBook);
router.register(deleteBook);

/* Assignment 4 */
router.register(lookupBookById);
router.register(placeBooksOnShelf);
router.register(orderBooks);
router.register(listOrders);
router.register(findBookOnShelf);
router.register(fulfilOrder);

// CORS support.
app.use(cors())

export type BookID = string;

// Set our mongoDB url to connect to.
const DB = "mongodb://mongo:27017";

// Connect to our mongoDB inside the dev container. Output the result and check if an error occured.
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err: string) => console.log("Mongoose DB connection error: ", err));

// Set the routes to be used.
app.use(router.routes());

// Start our server.
app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

