"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const mongoose = require("mongoose");
exports.Orders = mongoose.model("Orders", {
    OrderId: { type: String },
    BookID: { type: Array },
    // shelf: { type: String }
});
