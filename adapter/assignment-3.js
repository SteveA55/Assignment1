"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assignment_2_1 = __importDefault(require("./assignment-2"));
const Yup = __importStar(require("yup"));
// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters) {
    // Validate our input on the frontend to make sure it is as expected.
    const validationSchema = Yup.array().of(Yup.object().shape({
        from: Yup.number().optional().positive(),
        to: Yup.number().optional().positive(),
        name: Yup.string().optional(),
        author: Yup.string().optional(),
    }));
    let result;
    // Perform validation on our filters. Log errors that may occur.
    if (filters != undefined) {
        try {
            result = await validationSchema.validate(filters);
        }
        catch (err) {
            console.log("ERROR validation: ", err);
            throw new Error(`Validation ERROR ${err}`);
        }
    }
    // If our validation on the froentend was a success, log the result to console.
    if (result) {
        console.log("Yup (validation) result: ", result);
    }
    if (filters != undefined) {
        // Create our base url to avoid repeating the same code.
        const baseUrl = "http://localhost:3000/booksFilters?";
        var fetchUrl = `${baseUrl}`;
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
        });
    }
    // Send our filters to the backend and retrieve the resulting books.
    // Had to add an await here, since we need to wait for the fetch to conclude
    const response = await fetch(`${fetchUrl}`)
        // Convert the result to JSON format for processing.
        .then(res => res.json())
        .then((data) => {
        // Had to convert the result into an array and return it - there wasn't any return value before.
        return Object.keys(data).map((key) => data[key]);
    })
        // Log any errors that may occur.
        .catch((err) => {
        console.log("FETCH ERROR.........", err);
    });
    // Verify that our result has return as expected.
    console.log("... Assignment 3 listBooks data ... ", response);
    return (response);
}
async function createOrUpdateBook(book) {
    return await assignment_2_1.default.createOrUpdateBook(book);
}
async function removeBook(book) {
    await assignment_2_1.default.removeBook(book);
}
const assignment = 'assignment-3';
exports.default = {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};
