"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assignment_3_1 = __importDefault(require("./assignment-3"));
// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters) {
    return await assignment_3_1.default.listBooks(filters);
}
async function createOrUpdateBook(book) {
    return await assignment_3_1.default.createOrUpdateBook(book);
}
async function removeBook(book) {
    await assignment_3_1.default.removeBook(book);
}
// Set the base url to avoid repeating code.
var baseUrl = "http://localhost:3000/booksAssignment4";
async function lookupBookById(book) {
    // Add our params to the url.
    const fetchUrl = `${baseUrl}?BookID=${book}`;
    // Fetch the response on the backend and await the results.
    const response = await fetch(`${fetchUrl}`);
    const data = await response.json();
    // Verify we are returning the correct data.
    console.log("lookupBookById....lookupBookById...lookupBookById", data);
    return data;
}
async function placeBooksOnShelf(bookId, numberOfBooks, shelf) {
    // Add our params to the url.
    const fetchUrl = `${baseUrl}/warehouse?bookId=${bookId}&numberOfBooks=${numberOfBooks}&shelf=${shelf}`;
    // Fetch the response on the backend and await the results.
    const response = await fetch(`${fetchUrl}`);
    const data = await response.json();
    // Verify we are returning the correct data.
    console.log("placeBooksOnShelf....placeBooksOnShelf...placeBooksOnShelf", data);
    return (data);
}
async function orderBooks(order) {
    // Add our params to the url.
    var fetchUrl = `${baseUrl}/createOrder?`;
    // Loop through our array and add params to the fetch request one element at a time.
    order?.map((oneBookID, index) => {
        fetchUrl += `BookID[${index}]=${oneBookID}`;
        // Add & only if we are NOT on the first iteration, possible bug fix before bug exists.
        if (index >= 1)
            fetchUrl += "&";
    });
    // Fetch the response on the backend and await the results.
    const response = await fetch(`${fetchUrl}`);
    const data = await response.json();
    // Verify we are returning the correct data.
    console.log("orderBooks....orderBooks.....orderBooks", data);
    return (data);
}
async function findBookOnShelf(book) {
    // Add our params to the url.
    const fetchUrl = `${baseUrl}/warehouse?bookId=${book}`;
    // Fetch the response on the backend and await the results.
    const response = await fetch(`${fetchUrl}`);
    const data = await response.json();
    // Verify we are returning the correct data.
    console.log("findBookOnShelf....findBookOnShelf...findBookOnShelf", data);
    return (data);
}
async function fulfilOrder(order, booksFulfilled) {
    // Add our sub url to the base url.
    var fetchUrl = `${baseUrl}/Fulfilorders?`;
    // Loop through our array and add params to the fetch request one element at a time.
    booksFulfilled?.map((oneBook, index) => {
        fetchUrl += `bookfulfilled[${index}]=${oneBook[index].BookID}&`;
        fetchUrl += `bookfulfilled[${index}]=${oneBook[index].OrderId}&`;
        fetchUrl += `bookfulfilled[${index}]=${oneBook[index].ShelfId}&`;
        fetchUrl += `bookfulfilled[${index}]=${oneBook[index].numberOfBooks}&`;
        // Add & only if we are NOT on the first iteration, possible bug fix before bug even exists.
        if (index >= 1)
            fetchUrl += "&";
    });
    // Fetch the response on the backend and await the results.
    const response = await fetch(`${fetchUrl}`);
    const data = await response.json();
    // Verify we are returning the correct data.
    console.log("fulfilOrder....fulfilOrder...fulfilOrder", data);
    return (data);
}
async function listOrders() {
    // Add our sub url to the base url.
    const fetchUrl = `${baseUrl}/orders?`;
    // Fetch the response on the backend and await the results.
    const response = await fetch(`${fetchUrl}`)
        // Convert our response to json.
        .then(res => res.json())
        // Had to convert the result into an array and return it 
        .then((data) => {
        return Object.keys(data).map((key) => data[key]);
    })
        // Catch any errors that may occur to provide better clarity.
        .catch((err) => {
        console.log("FETCH ERROR.........", err);
        throw new Error("Fetch error has occured........", err);
    });
    // Verify we are returning the correct data.
    console.log("listOrders....listOrders.....listOrders", JSON.stringify(response));
    return (response);
}
const assignment = 'assignment-4';
exports.default = {
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
};
