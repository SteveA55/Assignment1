"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelf = void 0;
const mongoose = require("mongoose");
exports.Shelf = mongoose.model("Shelf", {
    bookId: { type: String },
    numberOfBooks: { type: Number },
    shelf: { type: String }
});
