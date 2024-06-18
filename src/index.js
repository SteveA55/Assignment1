"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_zod_router_1 = __importDefault(require("koa-zod-router"));
// Import our routes from previous assignments in a more organized manner.
const Assignment1and2_1 = require("./routes/Assignment1and2");
const Assignment3_1 = require("./routes/Assignment3");
const Assignment4_1 = require("./routes/Assignment4");
const cors = require('@koa/cors');
const app = new koa_1.default();
const router = (0, koa_zod_router_1.default)();
const mongoose = require("mongoose");
/* Assignment 1 & 2 */
router.register(Assignment1and2_1.listBooks);
/* Assignment 3 */
router.register(Assignment3_1.listBooksMultipleFilters);
router.register(Assignment3_1.createBook);
router.register(Assignment3_1.updateBook);
router.register(Assignment3_1.deleteBook);
/* Assignment 4 */
router.register(Assignment4_1.lookupBookById);
router.register(Assignment4_1.placeBooksOnShelf);
router.register(Assignment4_1.orderBooks);
router.register(Assignment4_1.listOrders);
router.register(Assignment4_1.findBookOnShelf);
router.register(Assignment4_1.fulfilOrder);
// CORS support.
app.use(cors());
// Set our mongoDB url to connect to.
const DB = "mongodb://mongo:27017";
// Connect to our mongoDB inside the dev container. Output the result and check if an error occured.
mongoose
    .connect(DB, {})
    .then(() => console.log("DB connection successful!"))
    .catch((err) => console.log("Mongoose DB connection error: ", err));
// Set the routes to be used.
app.use(router.routes());
// Start our server.
app.listen(3000, () => {
    console.log('app listening on http://localhost:3000');
});
