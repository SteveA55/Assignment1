"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// If you have multiple filters, a book matching any of them is a match.
async function listBooks(books, filters) {
    const filteredBooks = [];
    // Loop through all books and filters, only return the books that match the indicated filters.
    books?.map((book) => {
        filters?.map((filter) => {
            // Check the current book if it matches the current filter, if so, push that book onto array.
            if (book.price <= filter.to && book.price >= filter.from) {
                filteredBooks.push(book);
            }
        });
    });
    // Return only the books that matched the filters.
    return await filteredBooks;
}
const assignment = "assignment-1";
exports.default = {
    assignment,
    listBooks
};
