import assignment1 from "./assignment-1";
//import axios from "axios";
import * as Yup from "yup";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
}
/*
interface myBooks {
    filteredBooks: Book,
}
*/



async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {


    const validationSchema = Yup.object({
        from: Yup.number().optional().positive(),
        to: Yup.number().optional().positive()
    });

    /*
 Set our fetch URL based upon supplied from and to query.
 If no from or to query exists, create a default value.
 This prevents fatal TypeError from crashing our application
 when no from or to query is provided.
*/
    if (filters === undefined) { return []; }
    const defaultFilterFrom = 0;
    const defaultFilterTo = 100;


    var fetchUrl;


    const errors = validationSchema.validate(filters[0]);
    validationSchema.validate(filters[0]);

    if (filters[0]?.from != undefined && filters[0]?.to != undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].from}&to=${filters[0].to}`;

    else if (filters[0]?.from != undefined && filters[0].to === undefined)
        fetchUrl = `http://localhost:3000/booksList?to=${filters[0].from}`;

    else if (filters[0]?.to != undefined && filters[0].from === undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].to}`;

    const Books: Book[] = [];

    const result = await fetch(`${fetchUrl}`)
        .then(res => res.json())
        .then((data: object | any) => {
            console.log("FETCH RESPONSE.......", data);
            data.filteredBooks.map((eachBook: Book) => {
                Books.push(eachBook);
                console.log("-----------ALLL BOOKS-------------", Books)
            })
        }).catch((err) => {
            console.log("FETCH ERROR.........", err)
        })

    console.log("---------is the value present right now---------", Books);
    return (await Books as Book[])


}

async function createOrUpdateBook(book: Book): Promise<BookID> {

    // DEBUG
    console.log("...........Book............", book)

    // Unable to get it working with de-coded OR en-coded url params.
    console.log("--------------DECODED-------------------", decodeURI(JSON.stringify(book)));
    const bookParams: string = decodeURI(JSON.stringify(book));
    const result: Book | any = fetch(`http://localhost:3000/books?${bookParams}`, {
        method: "POST"
    }).then(res => res.json())
        .then((data: object | any) => {
            console.log("........data........", data)
        }).catch((err) => {
            console.log("FETCH ERROR.........", err)
        })
    //throw new Error("Todo")
    return (await result)
}

async function removeBook(book: BookID): Promise<void> {

    // DEBUG
    console.log("---------(REMOVE) BOOK ID----------", book)

    const result: Promise<void> = fetch(`http://localhost:3000/books?${book}`, {
        method: "DELETE"
    }).then(res => res.json())
        .then((data: object | any) => {
            console.log("........data........", data)
        }).catch((err) => {
            console.log("FETCH ERROR.........", err)
        })
    //throw new Error("Todo")
    return result;
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};

