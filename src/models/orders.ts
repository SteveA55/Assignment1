const mongoose = require("mongoose");

export const Orders = mongoose.model("Orders", {
    OrderId: { type: String },
    BookID: { type: Array },
    // shelf: { type: String }

})

