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

// DEBUG
var books: any = [
  {
    "name": "Giant's Bread",
    "author": "Agatha Christie",
    "description": "'A satisfying novel.' New York Times 'When Miss Westmacott reaches the world of music, her book suddenly comes alive. The chapters in which Jane appears are worth the rest of the book put together.' New Statesman --This text refers to an out of print or unavailable edition of this title.",
    "price": 21.86,
    "image": "https://upload.wikimedia.org/wikipedia/en/4/45/Giant%27s_Bread_First_Edition_Cover.jpg"
  },
  {
    "name": "Appointment with Death",
    "author": "Agatha Christie",
    "description": "In this exclusive authorized edition from the Queen of Mystery, the unstoppable Hercule Poirot finds himself in the Middle East with only one day to solve a murder..",
    "price": 19.63,
    "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Appointment_with_Death_First_Edition_Cover_1938.jpg/220px-Appointment_with_Death_First_Edition_Cover_1938.jpg"
  },
  {
    "name": "Beowulf: The Monsters and the Critics",
    "author": "J.R.R Tolkein",
    "description": "J. R. R. Tolkien's essay 'Beowulf: The Monsters and the Critics', initially delivered as the Sir Israel Gollancz Memorial Lecture at the British Academy in 1936, and first published as a paper in the Proceedings of the British Academy that same year, is regarded as a formative work in modern Beowulf studies. In it, Tolkien speaks against critics who play down the monsters in the poem, namely Grendel, Grendel's mother, and the dragon, in favour of using Beowulf solely as a source for Anglo-Saxon history.",
    "price": 19.95,
    "image": "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Beowulf_The_Monsters_and_the_Critics_1936_title_page.jpg/220px-Beowulf_The_Monsters_and_the_Critics_1936_title_page.jpg"
  },
  {
    "name": "The Complete Works of William Shakespeare",
    "author": "William Shakespeare",
    "description": "No library is complete without the classics! This leather-bound edition includes the complete works of the playwright and poet William Shakespeare, considered by many to be the English language’s greatest writer.",
    "price": 39.99,
    "image": "https://m.media-amazon.com/images/I/71Bd39ofMAL._SL1500_.jpg"
  },
  {
    "name": "Iliad & Odyssey ",
    "author": "Homer",
    "description": "No home library is complete without the classics! Iliad & Odyssey brings together the two essential Greek epics from the poet Homer in an elegant, leather-bound, omnibus edition-a keepsake to be read and treasured.",
    "price": 33.99,
    "image": "https://m.media-amazon.com/images/I/71ZWKmOIpVL._SL1500_.jpg"
  },
  {
    "name": "Iliad & Odyssey ",
    "author": "Homer",
    "description": "No home library is complete without the classics! Iliad & Odyssey brings together the two essential Greek epics from the poet Homer in an elegant, leather-bound, omnibus edition-a keepsake to be read and treasured.",
    "price": 33.99,
    "image": "https://m.media-amazon.com/images/I/71ZWKmOIpVL._SL1500_.jpg"
  },
  {
    "name": "Modern Software Engineering: Doing What Works to Build Better Software Faster",
    "author": "David Farley",
    "description": "In Modern Software Engineering, continuous delivery pioneer David Farley helps software professionals think about their work more effectively, manage it more successfully, and genuinely improve the quality of their applications, their lives, and the lives of their colleagues.",
    "price": 51.56,
    "image": "https://m.media-amazon.com/images/I/81sji+WquSL._SL1500_.jpg"
  },
  {
    "name": "Domain-Driven Design: Tackling Complexity in the Heart of Software ",
    "author": "Eric Evans",
    "description": "Leading software designers have recognized domain modeling and design as critical topics for at least twenty years, yet surprisingly little has been written about what needs to be done or how to do it.",
    "price": 91.99,
    "image": "https://m.media-amazon.com/images/I/71Qde+ZerdL._SL1500_.jpg"
  }
]

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {

  // This code makes an assumption:
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



  // We submitted this in Assignment 3. But the following version below this one
  // is a little cleaner.
  /* var fetchResult: any = fetch(`${fetchUrl}`)
     .then(res => res.json())
     .then((data: object | any) => {
       console.log("Response data::::::::::::", data);
       //books.push(data);
     }).catch((err) => {
       console.log("FETCH ERROR.........", err)
     })
 */


  // Cleaner code than previously (above).
  // proper type Book[] is used rather than type "any"

  // Send our filters to the backend and retrieve the resulting books.
  const response = await fetch(`${fetchUrl}`);
  const data: Promise<Book[]> = await response.json() as Promise<Book[]>;
  console.log("---------books--------", data)
  return (data);
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
