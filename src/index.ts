import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import applyRoutes from 'koa-zod-router';
import { z } from 'zod';
//import assignment1 from "../adapter/assignment-1";
import assignment2 from "../adapter/assignment-2";
import { Query } from 'mongoose';

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


app.use(cors())

const books: Array<object> = JSON.parse(fs.readFileSync(`./mcmasteful-book-list.json`, 'utf8'));

//console.log("Assignment1,,,,,,,,", assignment1)
export type BookID = string;



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



app.use(router.routes());

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

app.use(cors)

