import assignment1 from "./assignment-1";
const mongoose = require("mongoose");

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