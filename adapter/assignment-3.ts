import previous_assignment from './assignment-2'
import * as Yup from "yup";

export type BookID = string


export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
}

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
}

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {

  // Validate our input on the frontend to make sure it is as expected.
  const validationSchema = Yup.array().of(

    Yup.object().shape({

      from: Yup.number().optional().positive(),
      to: Yup.number().optional().positive(),
      name: Yup.string().optional(),
      author: Yup.string().optional(),

    })

  );

  let result;

  // Perform validation on our filters. Log errors that may occur.
  if (filters != undefined) {

    try {

      result = await validationSchema.validate(filters);

    } catch (err: unknown) {

      console.log("ERROR validation: ", err)
      throw new Error(`Validation ERROR ${err}`)

    }

  }

  // If our validation on the froentend was a success, log the result to console.
  if (result) {

    console.log("Yup (validation) result: ", result);

  }

  if (filters != undefined) {

    // Create our base url to avoid repeating the same code.
    const baseUrl: string = "http://localhost:3000/booksFilters?";
    var fetchUrl: string | undefined = `${baseUrl}`;

    // Loop through each filter, attach each filter to the URL and send all filters to the backend.
    filters.map((eachFilter) => {

      // If each filter exists, attach it to the URL.
      if (eachFilter.author)
        fetchUrl += `&author=${eachFilter.author}`;

      else if (eachFilter.name)
        fetchUrl += `&name=${eachFilter.name}`;

      else if (eachFilter.from && eachFilter.to)
        fetchUrl += `&from=${eachFilter.from}&to=${eachFilter.to}`;

      else if (eachFilter.from)
        fetchUrl += `&from=${eachFilter.from}&to=100`;

      else if (eachFilter.to)
        fetchUrl += `&from=1&to=${eachFilter.to}`;


    })
  }


  // Send our filters to the backend and retrieve the resulting books.
  // Had to add an await here, since we need to wait for the fetch to conclude
  const response: any = await fetch(`${fetchUrl}`)

    // Convert the result to JSON format for processing.
    .then(res => res.json())

    .then((data: object | any) => {

      // Had to convert the result into an array and return it - there wasn't any return value before.
      return Object.keys(data).map((key) => data[key]);

    })

    // Log any errors that may occur.
    .catch((err) => {

      console.log("FETCH ERROR.........", err)

    })

  // Verify that our result has return as expected.
  console.log("... Assignment 3 listBooks data ... ", response)

  return (response);

}

async function createOrUpdateBook(book: Book): Promise<BookID> {

  return await previous_assignment.createOrUpdateBook(book)

}

async function removeBook(book: BookID): Promise<void> {

  await previous_assignment.removeBook(book)

}

const assignment = 'assignment-3'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
}
