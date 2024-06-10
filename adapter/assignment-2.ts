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

    // console.log("Filters [1]....", filters[1]) // undefined
    const validationSchema = Yup.object({
        from: Yup.number().optional().positive(),
        to: Yup.number().optional().positive()
    });
    if (filters === undefined) { return []; }
    const defaultFilterFrom = 0;
    const defaultFilterTo = 100;

    /*
     Set our fetch URL based upon supplied from and to query.
     If no from or to query exists, create a default value.
     This prevents fatal TypeError from crashing our application
     when no from or to query is provided.
    */
    var fetchUrl;


    //const errors = validationSchema.validate(filters[0]);
    //validationSchema.validate(filters[0]);

    if (filters[0]?.from != undefined && filters[0]?.to != undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].from}&to=${filters[0].to}`;

    else if (filters[0]?.from != undefined && filters[0].to === undefined)
        fetchUrl = `http://localhost:3000/booksList?to=${filters[0].from}`;

    else if (filters[0]?.to != undefined && filters[0].from === undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].to}`;


    /* DEBUG - We may want to debug with this again later.
        console.log(`Filters BOTH.... from: ${filters[0].from} TO: ${filters[0].to}`);
        console.log("type of filters", typeof (filters));
        console.log("Array?", typeof ([]));
        console.log("filters [0] FROM", filters[0].from);
        console.log("filters [0] TO", filters[0].to);
    */

    //var Books: any = [];
    const Books: Book[] = [];
    /*  Un-used code but we may want to re-try these potential solutions later.
        var filteredBooks: Array<object> = [];
        var Books: Array<object> = [];
        var Books: Book[] = [];

        var data: Array<object> = [];
        var someBooks: myBooks[] = [];
        */

    /* Instructor comments:
            Should await the fetch itself.
            Have the fetch itself return the book as an book array
    */
    const result = await fetch(`${fetchUrl}`)
        .then(res => res.json())
        .then((data: object | any) => {
            console.log("FETCH RESPONSE.......", data);
            data.filteredBooks.map((eachBook: Book) => {
                Books.push(eachBook);
                console.log("-----------ALLL BOOKS-------------", Books)
            })
            /* Un-used code but we may want to re-try these potential solutions later.
            Books.push(data.filteredBooks)
            Books = data;
            someBooks.push(data.filteredBooks[0])
            console.log("------data---------", someBooks)
            */
        }).catch((err) => {
            console.log("FETCH ERROR.........", err)
        })
    /* Un-used code but we may want to re-try these potential solutions later.
          console.log("RESULT OF FETCH.......................", resultFetch);
          return assignment1.listBooks(filters);
          return listBooks(filters);
          return (await Books);
          return [];
          return (await Books.map((eachBook) => { return eachBook }) as Book[])
          return (await JSON.parse(Books) as Book[])
          */
    console.log("---------is the value present right now---------", Books);
    return (await Books as Book[])

    /* Instructor comments:
        Create interface like book api return
        Write out a type defintion
        Define a type that matches what you are returning from server
        Cast the data as that type.
        After defining type you can modify data.filteredBooks
        Try to avoid | any in the future if possible
        The way you decide to build you json is up to you
        Focus on good structure otherwise
    */

    /* Un-used code but we may want to re-try these potential solutions later.
          var test = { filteredBooks: Book[] }
          var abook = [{ "name": "Steve", "author": "Jim" }]
          console.log("Before returning books....................", Books)
          return (await someBooks as Book[]);
      */

    /* DEBUG - hardcoded data, may we want to debug this again later.
      var abook: any = [
          {
              "name": "Appointment with Death",
              "author": "Agatha Christie",
              "description": "In this exclusive authorized edition from the Queen of Mystery, the unstoppable Hercule Poirot finds himself in the Middle East with only one day to solve a murder..",
              "price": 19.63,
              "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Appointment_with_Death_First_Edition_Cover_1938.jpg/220px-Appointment_with_Death_First_Edition_Cover_1938.jpg"
          },
          {
              "name": "Appointment with Death",
              "author": "Agatha Christie",
              "description": "In this exclusive authorized edition from the Queen of Mystery, the unstoppable Hercule Poirot finds himself in the Middle East with only one day to solve a murder..",
              "price": 19.63,
              "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Appointment_with_Death_First_Edition_Cover_1938.jpg/220px-Appointment_with_Death_First_Edition_Cover_1938.jpg"
          }
      ]
      console.log("---------A BOOK (dummy data)----------", abook)
      return (await abook as Book[])
*/
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

