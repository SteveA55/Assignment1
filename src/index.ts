import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import applyRoutes from 'koa-zod-router';
import { z } from 'zod';
//import assignment1 from "../adapter/assignment-1";
import assignment2 from "../adapter/assignment-2";
import { Query } from 'mongoose';

import { listBooks } from './routes/Assignment1and2';
import { listBooksMultipleFilters, createBook, updateBook, deleteBook, } from './routes/Assignment3';
import { lookupBookById, placeBooksOnShelf, orderBooks, listOrders, findBookOnShelf, fulfillOrder } from './routes/Assignment4';


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
router.register(fulfillOrder);


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

/*
const Book = mongoose.model("Book", {
    id: { type: Number },
    name: { type: String },
    author: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
});

const Shelf = mongoose.model("Shelf", {
    bookId: { type: String },
    numberOfBooks: { type: Number },
    shelf: { type: String }

})

const Orders = mongoose.model("Orders", {
    OrderId: { type: String },
    BookID: { type: Array },
    // shelf: { type: String }

})
*/



app.use(router.routes());

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

app.use(cors)



/* Un-needed code - we may want to re-introduce later. - Assignment 1 - fetch all books


            console.log("------COMPARISON---------", parseInt(howManyFilters), ":", howManyFiltersCorrect)

        if (query === undefined) { return; }

       Un-used code we may want to revisit later.
                ctx.response.body = { books }
                ctx.response.body = { ...filteredBooks }
                console.log("----- Sending back filteredBooks list-----------");
                 return filteredBooks;
     


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

--- Inside books.map-- -
              if (typeof (query) === "object") {
    if (query != undefined) {
        ;
        query?.map((filter: object | any) => {
            DEBUG
            console.log("FROM::::::::", filter.from, "TO:::::::", filter.to);
            console.log("CURRENT BOOOK...........", book);
            Check the current book if it matches the current filter, if so, push that book onto array.


                for(const key in filteredBooks) {

            console.log("value", filteredBooks[key]);
        }
        ----After books.map-----
            console.log("DISPLAY............", books?.display)

        filteredBooks.map((book) => {
            console.log("BOOOOOOOOOOOOOOOOK", book)
        })

            */
