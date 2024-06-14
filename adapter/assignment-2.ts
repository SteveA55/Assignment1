//import assignment1 from "./assignment-1";

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


async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {


    // Validate our input on the frontend to make sure the input is as expected.
    const validationSchema = Yup.object({
        from: Yup.number().optional().positive(),
        to: Yup.number().optional().positive()
    });


    if (filters === undefined) { return []; }


    var fetchUrl;

    try {
        // Test our input against the proper validation.
        await validationSchema.validate(filters[0]);

    } catch (err) {

        console.log("Validation ERROR:", err);
        throw new Error(`Validation ERROR ${err}`)

    }

    // We have to adjust our params sent to the backend based upon the critea of the supplied input which
    // could be supplied in various formats.
    if (filters[0]?.from != undefined && filters[0]?.to != undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].from}&to=${filters[0].to}`;

    else if (filters[0]?.from != undefined && filters[0].to === undefined)
        fetchUrl = `http://localhost:3000/booksList?to=${filters[0].from}`;

    else if (filters[0]?.to != undefined && filters[0].from === undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].to}`;

    const Books: Book[] = [];

    // Fetch the URL on the backend and await the result.
    await fetch(`${fetchUrl}`)

        // Convert the response to JSON format for processing.
        .then(res => res.json())

        .then((data: object | any) => {

            data.filteredBooks.map((eachBook: Book) => {

                // Since we are desiring an array as the end result. Push the element onto our array.
                Books.push(eachBook);

            })
        }).catch((err) => {

            console.log("FETCH ERROR.........", err)

        })


    console.log("---------is the value present right now---------", Books);

    return (await Books as Book[])

}

async function createOrUpdateBook(book: Book): Promise<BookID> {



    // Unable to get it working with de-coded OR en-coded url params.
    const bookParams: string = decodeURI(JSON.stringify(book));

    const result: Book | any = fetch(`http://localhost:3000/books?${bookParams}`, {

        method: "POST"

    })

        // Convert the response to JSON format for processing.
        .then(res => res.json())

        .then((data: object | any) => {

            console.log("........data........", data)

        }).catch((err) => {

            console.log("FETCH ERROR.........", err)

        })


    return (await result)

}


async function removeBook(book: BookID): Promise<void> {


    const result: Promise<void> = fetch(`http://localhost:3000/books?${book}`, {

        method: "DELETE"

    })

        // Conver the response to JSON format for processing.
        .then(res => res.json())

        .then((data: object | any) => {

            console.log("........data........", data)

        }).catch((err) => {

            console.log("FETCH ERROR.........", err)

        })


    return result;

}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};

