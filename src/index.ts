import axios from "axios";
import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { array, z } from 'zod';
import assignment1 from "../adapter/assignment-1";

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
        var filteredBooks: Promise<object> = assignment1.listBooks(books, [{ "from": query.from, "to": query.to }]);

        // Send the filtered book list as json back to the user
        filteredBooks.then((value) => {
            // console.log("value:::::::::", value);
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