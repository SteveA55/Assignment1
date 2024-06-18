"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose = require("mongoose");
exports.Book = mongoose.model("Book", {
    id: { type: Number },
    name: { type: String },
    author: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
});
