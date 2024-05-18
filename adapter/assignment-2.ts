import assignment1 from "./assignment-1";
//const mongoose = require("mongoose");
//import zodRouter from 'koa-zod-router';
//const router = zodRouter();
import axios from "axios";
import * as Yup from "yup";
import { arrayOutputType } from "zod";



export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

interface myBooks {
    filteredBooks: Book,
}

console.log("mcmasterful-books?????")
//var filters = [{ "from": 5, "to": 10 }]
//listBooks(filters)


async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {

    //console.log("Filters [1]....", filters[1]) // undefined
    const validationSchema = Yup.object({
        from: Yup.number().required().positive(),
        to: Yup.number().optional().positive()
    });
    if (filters === undefined) { return []; }
    var defaultFilterFrom = 0;
    var defaultFilterTo = 100;
    //if (filters === undefined) { filters[0].from = 10 }
    if (filters.length >= 1) {
        const errors = validationSchema.validate(filters[0]);
        var fetchUrl = `http://localhost:3000/booksList?from=${filters[0].from}&to=${filters[0].to}`
    } else {
        var fetchUrl = `http://localhost:3000/booksList?from=${defaultFilterFrom}&to=${defaultFilterTo}`
    }
    //console.log(`Filters BOTH.... from: ${filters[0].from} TO: ${filters[0].to}`);
    //console.log("type of filters", typeof (filters));
    //console.log("Array?", typeof ([]));
    //console.log("filters [0] FROM", filters[0].from);
    //console.log("filters [0] TO", filters[0].to);
    //console.log("Axios fetching.....");

    //var filteredBooks: Array<object> = [];
    var Books: Array<object> = [];
    //var data: Array<object> = [];
    //var someBooks: myBooks[] = [];
    // Should await the fetch itself.
    // Have the fetch itself return the book as an book array

    fetch(`${fetchUrl}`)
        .then(res => res.json())
        .then((data: object | any) => {
            console.log("FETCH RESPONSE.......", data);
            Books.push(data.filteredBooks)
            //Books = data;

            // someBooks.push(data.filteredBooks[0])
            //console.log("------data---------", someBooks)
        }).catch((err) => {
            console.log("FETCH ERROR.........", err)
        })
    // console.log("RESULT OF FETCH.......................", resultFetch);
    //return assignment1.listBooks(filters);
    //return listBooks(filters);
    //return (await Books);
    ///return [];
    return (await Books as Book[])

    // Create interface like book api return
    // Write out a type defintion
    // Define a type that matches what you are returning from server
    // Cast the data as that type.
    // After defining type you can modify data.filteredBooks
    // Try to avoid | any in the future if possible
    // The way you decide to build you json is up to you
    // Focus on good structure otherwise

    //var test = { filteredBooks: Book[] }
    // var abook = [{ "name": "Steve", "author": "Jim" }]
    //console.log("Before returning books....................", Books)
    //return (await someBooks as Book[]);
    /* var abook: any = [{
 
 
         "name": "Appointment with Death",
         "author": "Agatha Christie",
         "description": "In this exclusive authorized edition from the Queen of Mystery, the unstoppable Hercule Poirot finds himself in the Middle East with only one day to solve a murder..",
         "price": 19.63,
         "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Appointment_with_Death_First_Edition_Cover_1938.jpg/220px-Appointment_with_Death_First_Edition_Cover_1938.jpg"
 
 
     }]
 */
    //return (await abook as Book[])
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    console.log("GET all books...");
    axios(`http://localhost:3000/books`, {
        method: "POST"
    }).then((response) => {
        console.log("RESPONSE:::::", response.data);
    }).catch((err) => {
        console.log("ERR:::::", err);
    })
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