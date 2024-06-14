import { string } from 'zod'
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
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};



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
  return await previous_assignment.listBooks(filters); // I added this previous assignment line, not instructor.
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

var baseUrl: string = "http://localhost:3000/booksAssignment4";

async function lookupBookById(book: BookID): Promise<Book> {
  // Backend is built.
  // Frontend can't see anything in console.log

  var fetchUrl: string | undefined = `${baseUrl}?BookID=${book}`;

  const response = await fetch(`${fetchUrl}`);
  const data: Promise<Book> = await response.json() as Promise<Book>;

  console.log("lookupBookById....lookupBookById...lookupBookById", data)

  return (data as Promise<Book>);

  //throw new Error("Todo")
}

export type ShelfId = string
export type OrderId = string

async function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {
  var fetchUrl: string | undefined = `${baseUrl}/warehouse?bookId=${bookId}&numberOfBooks=${numberOfBooks}&shelf=${shelf}`;

  const response = await fetch(`${fetchUrl}`);
  const data: Promise<void> = await response.json() as Promise<void>;

  console.log("placeBooksOnShelf....placeBooksOnShelf...placeBooksOnShelf", data)

  return (data);
}

async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {
  // Backend is built.
  // Frontend is built, however we are un-able to test it.

  var fetchUrl: string | undefined = `${baseUrl}/createOrder?`;
  //var fetchUrl: string | undefined = `${baseUrl}?BookID=${book}`;

  console.log("^^^^^^^^^DEBUG ORDERBOOKS^^^^^^^", order)

  // Going to have .map through array
  // Since having trouble on backend with query as array prefer to do it on frontend.
  order?.map((oneBookID, index) => {
    fetchUrl += `BookID[${index}]=${oneBookID}`

    // Add & only if we are NOT on the first iteration, possible bug fix before bug even exists.
    if (index >= 1) fetchUrl += "&"
  })

  console.log("*** orderBooks fetchUrl ****", fetchUrl)

  const response = await fetch(`${fetchUrl}`);
  //const data: Promise<Book[]> = await response.json() as Promise<Book[]>;
  const data: Promise<OrderIdKeyValue> = await response.json() as Promise<OrderIdKeyValue>;

  console.log("orderBooks....orderBooks.....orderBooks", data)

  return (data);
  throw new Error("Todo")
}

async function findBookOnShelf(book: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  // Backend is built.
  // Unable to test front-end or see console.log.

  var fetchUrl: string | undefined = `${baseUrl}/warehouse?bookId=${book}`;

  const response = await fetch(`${fetchUrl}`);
  const data: Promise<shelve[]> = await response.json() as Promise<shelve[]>;

  console.log("findBookOnShelf....findBookOnShelf...findBookOnShelf", data)

  return (data as Promise<shelve[]>);
  //throw new Error("Todo")
}

async function fulfilOrder(order: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {

  var fetchUrl: string | undefined = `${baseUrl}/Fulfilorders?`;

  booksFulfilled?.map((oneBook: any, index) => {
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].BookID}&`
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].OrderId}&`
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].ShelfId}&`
    fetchUrl += `bookfulfilled[${index}]=${oneBook[index].numberOfBooks}&`

    // Add & only if we are NOT on the first iteration, possible bug fix before bug even exists.
    if (index >= 1) fetchUrl += "&"
  })

  console.log("%%%%% FETCHURL %%%%%%%%%", fetchUrl);

  const response = await fetch(`${fetchUrl}`);
  const data: Promise<void> = await response.json() as Promise<void>;

  console.log("fulfilOrder....fulfilOrder...fulfilOrder", data)

  return (data);
}



async function listOrders(): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  // Backend is built.
  // Frontend is working in console.log only.

  var fetchUrl: string | undefined = `${baseUrl}/orders?`;

  const response: any = await fetch(`${fetchUrl}`)
    .then(res => res.json())
    .then((data: object | any) => {
      console.log("Response data::::::::::::", data);
      return Object.keys(data).map((key) => data[key]); // Had to convert the result into an array and return it - there wasn't any return value before.
      //books.push(data);
    }).catch((err) => {
      console.log("FETCH ERROR.........", err)
      throw new Error("Fetch error has occured........");
    });
  //const data: Promise<Book[]> = await response.json() as Promise<Book[]>;
  //const data: Promise<listOrders[]> = await response.json() as Promise<listOrders[]>;

  //console.log("listOrders....listOrders.....listOrders", data)

  console.log("@@@@@ RESPONSE ARRAY????? @@@@@@@@@", JSON.stringify(response));
  return (response);
  //throw new Error("Todo")
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
