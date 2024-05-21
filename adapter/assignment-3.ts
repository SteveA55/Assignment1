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
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {

  // If a from number is provided but not a to number. to is default to 100.
  // If a to number is provided but not a from number. from is default to 1.

  const validationSchema = Yup.array().of(
    Yup.object().shape({
      from: Yup.number().optional().positive(),
      to: Yup.number().optional().positive(),
      name: Yup.string().optional(),
      author: Yup.string().optional(),
    })
  );

  var result;

  if (filters != undefined) {
    try {
      result = await validationSchema.validate(filters);
      //var debug = await validationSchema.validate([{ author: 5 }])
    } catch (err: unknown) {
      console.log("ERROR validation: ", err)
      throw new Error(`Validation ERROR ${err}`)
    }
  }

  if (result) {
    console.log("Yup (validation) result: ", result);
    // console.log("Yup DEBUG ", debug);
  }

  if (filters != undefined) {
    //var fetchUrl: string = "";
    //fetchUrl = `http://localhost:3000/booksFilters?${filters}`;
    //console.log("DEBUG starting fetch...........", fetchUrl);
    filters.map((eachFilter, index) => {
      var fetchUrl: string = "";
      var baseUrl: string = "http://localhost:3000/booksFilters";
      //console.log("------- EACH FILTER--------", eachFilter.author)
      if (eachFilter.author) { fetchUrl = `${baseUrl}?author=${eachFilter.author}`; }
      else if (eachFilter.name) { fetchUrl = `${baseUrl}?name=${eachFilter.name}`; }
      else if (eachFilter.from && eachFilter.to) {
        console.log("FROMMMMM AND TOOOO", eachFilter.from, eachFilter.to)
        fetchUrl = `${baseUrl}?from=${eachFilter.from}&to=${eachFilter.to}`;
      }
      else if (eachFilter.from) {
        console.log("FROMMMMM AND TOOOO", eachFilter.from, eachFilter.to)
        fetchUrl = `${baseUrl}?from=${eachFilter.from}&to=100`;
      }
      else if (eachFilter.to) {
        console.log("FROMMMMM AND TOOOO", eachFilter.from, eachFilter.to)
        fetchUrl = `${baseUrl}?from=1&to=${eachFilter.to}`;
      }
      fetch(`${fetchUrl}`)
        .then(res => res.json())
        .then((data: object | any) => {
          console.log("----------DATA---------", data);
        }).catch((err) => {
          console.log("FETCH ERROR.........", err)
        })
    })
  }
  //`http://localhost:3000/booksList?from=${filters[0].from}&to=${filters[0].to}`

  throw new Error("Todo")
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
