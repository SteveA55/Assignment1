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
