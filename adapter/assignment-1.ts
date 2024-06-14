export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
}

// If you have multiple filters, a book matching any of them is a match.
async function listBooks(books?: Array<object>, filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {

    const filteredBooks: Array<object> = [];

    // Loop through all books and filters, only return the books that match the indicated filters.
    books?.map((book: object | any) => {

        filters?.map((filter: object | any) => {

            // Check the current book if it matches the current filter, if so, push that book onto array.
            if (book.price <= filter.to && book.price >= filter.from) {

                filteredBooks.push(book);

            }
        })
    })


    // Return only the books that matched the filters.
    return (await filteredBooks as Book[]);

}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};

