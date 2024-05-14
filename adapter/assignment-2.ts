import assignment1 from "./assignment-1";
const mongoose = require("mongoose");
import zodRouter from 'koa-zod-router';
const router = zodRouter();

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

const Book = mongoose.model("Book", {
    id: { type: Number },
    name: { type: String },
    author: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
});

assignment1.router.register({
    name: 'Create new book.',
    method: 'post',
    path: '/books',
    handler: async (ctx, next) => {
        let { body, headers, query, params } = ctx.request;
        // const id: string = query.from.id;
        console.log("type of id,", typeof (query.id))
        console.log("Create new book. ID::::::.", query.id);
        console.log("Create new book. AUTHOR::::::.", query.author);
        await next();
    },
    validate: {
        // Validate input. Make sure we are working with type number and not type string as an example.
        query: assignment1.z.object({
            id: assignment1.z.coerce.number(), name: assignment1.z.string(),
            author: assignment1.z.string(), description: assignment1.z.string(),
            price: assignment1.z.coerce.number(), image: assignment1.z.string()
        }),
    },
});



assignment1.app.use(router.routes());

async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {
    return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    throw new Error("Todo")
}

async function removeBook(book: BookID): Promise<void> {
    throw new Error("Todo")
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};