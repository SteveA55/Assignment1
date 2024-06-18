"use strict";
//import assignment1 from "./assignment-1";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
async function listBooks(filters) {
    // Validate our input on the frontend to make sure the input is as expected.
    const validationSchema = Yup.object({
        from: Yup.number().optional().positive(),
        to: Yup.number().optional().positive()
    });
    if (filters === undefined) {
        return [];
    }
    var fetchUrl;
    try {
        // Test our input against the proper validation.
        await validationSchema.validate(filters[0]);
    }
    catch (err) {
        console.log("Validation ERROR:", err);
        throw new Error(`Validation ERROR ${err}`);
    }
    // We have to adjust our params sent to the backend based upon the critea of the supplied input which
    // could be supplied in various formats.
    if (filters[0]?.from != undefined && filters[0]?.to != undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].from}&to=${filters[0].to}`;
    else if (filters[0]?.from != undefined && filters[0].to === undefined)
        fetchUrl = `http://localhost:3000/booksList?to=${filters[0].from}`;
    else if (filters[0]?.to != undefined && filters[0].from === undefined)
        fetchUrl = `http://localhost:3000/booksList?from=${filters[0].to}`;
    const Books = [];
    // Fetch the URL on the backend and await the result.
    await fetch(`${fetchUrl}`)
        // Convert the response to JSON format for processing.
        .then(res => res.json())
        .then((data) => {
        data.filteredBooks.map((eachBook) => {
            // Since we are desiring an array as the end result. Push the element onto our array.
            Books.push(eachBook);
        });
    }).catch((err) => {
        console.log("FETCH ERROR.........", err);
    });
    console.log("---------is the value present right now---------", Books);
    return await Books;
}
async function createOrUpdateBook(book) {
    // Unable to get it working with de-coded OR en-coded url params.
    const bookParams = decodeURI(JSON.stringify(book));
    const result = fetch(`http://localhost:3000/books?${bookParams}`, {
        method: "POST"
    })
        // Convert the response to JSON format for processing.
        .then(res => res.json())
        .then((data) => {
        console.log("........data........", data);
    }).catch((err) => {
        console.log("FETCH ERROR.........", err);
    });
    return (await result);
}
async function removeBook(book) {
    const result = fetch(`http://localhost:3000/books?${book}`, {
        method: "DELETE"
    })
        // Conver the response to JSON format for processing.
        .then(res => res.json())
        .then((data) => {
        console.log("........data........", data);
    }).catch((err) => {
        console.log("FETCH ERROR.........", err);
    });
    return result;
}
const assignment = "assignment-2";
exports.default = {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};
