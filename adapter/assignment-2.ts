import assignment1 from "./assignment-1";
//const mongoose = require("mongoose");
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