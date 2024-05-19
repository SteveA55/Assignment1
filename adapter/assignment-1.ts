import axios from "axios";
import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { array, z } from 'zod';

const cors = require('@koa/cors');
const fs = require("fs");
const app = new Koa();
const router = zodRouter();

export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

// Ended up not needing this
/* 
axios("http://localhost:3000/booksList?from=5&to=30", {
    method: "GET"
}).then((response) => {
    console.log("RESPONSE:::::", response.data);
}).catch((err) => {
    console.log("ERR:::::", err);
})
*/

// If you have multiple filters, a book matching any of them is a match.
async function listBooks(books?: Array<object>, filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {

    var filteredBooks: Array<object> = [];

    // Loop through all books and filters, only return the books that match the indicated filters.
    books?.map((book: object | any) => {
        filters?.map((filter: object | any) => {

            // Check the current book if it matches the current filter, if so, push that book onto array.
            if (book.price <= filter.to && book.price >= filter.from) {
                // DEBUG
                // console.log("A MATCH:::::", book.price);
                filteredBooks.push(book);
            }
        })
        // DEBUG
        //console.log(book);
    })
    //throw new Error("Todo")


    // Return only the books that matched the filters.
    return (await filteredBooks as Book[]);
}

const assignment = "assignment-1";
export default {
    assignment,
    listBooks
};

