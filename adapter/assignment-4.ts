import { } from 'zod'
import previous_assignment from './assignment-3'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
  stock?: number
}

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
}



export interface listOrders {
  orderId: string,
  books: Record<BookID, number>
}

export interface OrderIdKeyValue {
  orderId: string
}

export interface shelve {
  shelf: ShelfId,
  count: number,
}

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  return await previous_assignment.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

// Set the base url to avoid repeating code.
const baseUrl: string = "http://localhost:3000/booksAssignment4";

async function lookupBookById(book: BookID): Promise<Book> {

  // Add our params to the url.
  const fetchUrl: string | undefined = `${baseUrl}?BookID=${book}`;

  // Fetch the response on the backend and await the results.
  const response = await fetch(`${fetchUrl}`);
  const data: Promise<Book> = await response.json() as Promise<Book>;

  // Verify we are returning the correct data.
  console.log("lookupBookById....lookupBookById...lookupBookById", data)

  return (data as Promise<Book>);

}

export type ShelfId = string
export type OrderId = string

async function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {

  // Add our params to the url.
  const fetchUrl: string | undefined = `${baseUrl}/warehouse?bookId=${bookId}&numberOfBooks=${numberOfBooks}&shelf=${shelf}`;

  // Fetch the response on the backend and await the results.
  const response = await fetch(`${fetchUrl}`);
  const data: Promise<void> = await response.json() as Promise<void>;

  // Verify we are returning the correct data.
  console.log("placeBooksOnShelf....placeBooksOnShelf...placeBooksOnShelf", data)

  return (data);
}

async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {

  // Add our params to the url.
  let fetchUrl: string | undefined = `${baseUrl}/createOrder?`;

  // Loop through our array and add params to the fetch request one element at a time.
  order?.map((oneBookID, index) => {
    fetchUrl += `BookID[${index}]=${oneBookID}`

    // Add & only if we are NOT on the first iteration, possible bug fix before bug exists.
    if (index >= 1) fetchUrl += "&"

  })

  // Fetch the response on the backend and await the results.
  const response = await fetch(`${fetchUrl}`);
  const data: Promise<OrderIdKeyValue> = await response.json() as Promise<OrderIdKeyValue>;

  // Verify we are returning the correct data.
  console.log("orderBooks....orderBooks.....orderBooks", data)

  return (data);
}

async function findBookOnShelf(book: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {

  // Add our params to the url.
  const fetchUrl: string | undefined = `${baseUrl}/warehouse?bookId=${book}`;

  // Fetch the response on the backend and await the results.
  const response = await fetch(`${fetchUrl}`);
  const data: Promise<shelve[]> = await response.json() as Promise<shelve[]>;

  // Verify we are returning the correct data.
  console.log("findBookOnShelf....findBookOnShelf...findBookOnShelf", data)

  return (data);
}

async function fulfilOrder(order: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {

  // Add our sub url to the base url.
  let fetchUrl: string | undefined = `${baseUrl}/Fulfilorders?`;

  // Loop through our array and add params to the fetch request one element at a time.
  booksFulfilled?.map((oneBook: any, index) => {
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].BookID}&`
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].OrderId}&`
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].ShelfId}&`
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].numberOfBooks}&`

    // Add & only if we are NOT on the first iteration, possible bug fix before bug even exists.
    if (index >= 1) fetchUrl += "&"
  })

  // Fetch the response on the backend and await the results.
  const response = await fetch(`${fetchUrl}`);
  const data: Promise<void> = await response.json() as Promise<void>;

  // Verify we are returning the correct data.
  console.log("fulfilOrder....fulfilOrder...fulfilOrder", data)

  return (data);
}



async function listOrders(): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {

  // Add our sub url to the base url.
  const fetchUrl: string | undefined = `${baseUrl}/orders?`;

  // Fetch the response on the backend and await the results.
  const response: any = await fetch(`${fetchUrl}`)

    // Convert our response to json.
    .then(res => res.json())

    // Had to convert the result into an array and return it 
    .then((data: object | any) => {
      return Object.keys(data).map((key) => data[key]);
    })

    // Catch any errors that may occur to provide better clarity.
    .catch((err) => {
      console.log("FETCH ERROR.........", err)
      throw new Error("Fetch error has occured........", err);
    });

  // Verify we are returning the correct data.
  console.log("listOrders....listOrders.....listOrders", JSON.stringify(response))

  return (response);

}

const assignment = 'assignment-4'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById
}
