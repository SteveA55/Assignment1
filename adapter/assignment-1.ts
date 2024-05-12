import axios from "axios";
import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { array, z } from 'zod';
const cors = require('@koa/cors');
const fs = require("fs");

const app = new Koa();
const router = zodRouter();

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

        var filteredBooks: Promise<object> = listBooks([{ "from": query.from, "to": query.to }]);


        // Send the filtered book list as json back to the web browser
        filteredBooks.then((value) => {
            console.log("value:::::::::", value);

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

app.use(router.routes());

app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});

app.use(cors)

export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

// Didn't end up needing this.
// axios("http://localhost:3000/booksList?from=5&to=30", {
//     method: "GET"
// }).then((response) => {
//     console.log("RESPONSE:::::", response);
// }).catch((err) => {
//     console.log("ERR:::::", err);
// })


// If you have multiple filters, a book matching any of them is a match.
async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {

    // DEBUG
    //console.log("FILTERS::::", filters);
    //console.log("BOOKS::::::::", books)

    var filteredBooks: Array<object> = [];

    // Loop through all books and filters, only return the books that match the indicated filters.
    books?.map((book: object | any) => {
        filters?.map((filter: object | any) => {
            // DEBUG
            //console.log("FROM::::::::", filter.from, "TO:::::::", filter.to);

            // Check the current book if it matches the current filter, if so, push that book onto array.
            if (book.price <= filter.to && book.price >= filter.from) {
                //console.log("A MATCH:::::", book.price);
                filteredBooks.push(book);
            }
        })
        // DEBUG
        //console.log(book);
    })
    //throw new Error("Todo")

    // DEBUG
    console.log("Filtered Books.........", filteredBooks);

    // Return only the books that matched the filters.
    return (await filteredBooks as Book[]);

}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};