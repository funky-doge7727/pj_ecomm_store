const mongoose = require("mongoose")
const {Schema} = mongoose

const cupcakeSchema = new Schema(
    {
        cakeId: {type: Number, required: true, unique: true},
        name: {type: String, required: true},
        productLabel: {type: String, required: true},
        price: {type: Number, required: true},
        imagePath: {type: String, required: true},
        description: {type: String, required: true},
        quantity: {type: Number, required: true},
        sweet: {type: Number, required: true}
    }, {timestamps: true}
)

module.exports = mongoose.model("Cupcake", cupcakeSchema)

