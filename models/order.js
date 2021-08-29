const mongoose = require("mongoose")
const {Schema} = mongoose

const orderSchema = new Schema(
    {   
        orderId: {type: Number, required: true},
        user: {type: Object},
        cart: {type: Object, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        address: {type: String, required: true},
        postalCode: {type: Number, required: true},
        phone: {type: Number, required: true},
        email: {type: String, required: true},
        notes: {type: String},
        fulfilled: {type: Boolean, required: true}
    }, {timestamps: true}
)

module.exports = mongoose.model("Order", orderSchema)

