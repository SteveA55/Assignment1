import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import applyRoutes from 'koa-zod-router';
import { z } from 'zod';
//import assignment1 from "../adapter/assignment-1";
import assignment2 from "../adapter/assignment-2";
import { Query } from 'mongoose';

// Import our routes from previous assignments in a more organized manner.
import { listBooks } from './routes/Assignment1and2';
import { listBooksMultipleFilters, createBook, updateBook, deleteBook, } from './routes/Assignment3';
import { lookupBookById, placeBooksOnShelf, orderBooks, listOrders, findBookOnShelf, fulfilOrder } from './routes/Assignment4';

const cors = require('@koa/cors');
const fs = require("fs");
const app = new Koa();
const router = zodRouter();

const mongoose = require("mongoose");

import { Book } from "./models/books";
import { Orders } from "./models/orders";
import { Shelf } from "./models/shelf";

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

const books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));

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

