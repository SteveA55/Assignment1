const mongoose = require("mongoose");

export const Shelf = mongoose.model("Shelf", {
    bookId: { type: String },
    numberOfBooks: { type: Number },
    shelf: { type: String }
})