const mongoose = require("mongoose");

export const Book = mongoose.model("Book", {
    id: { type: Number },
    name: { type: String },
    author: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
});

