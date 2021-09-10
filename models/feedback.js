const mongoose = require("mongoose")
const {Schema} = mongoose

const feedbackSchema = new Schema(
    {   
        feedbackId: {type: Number, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        text: {type: String, required: true},
        usertype: {type: String, required: true}
    }, {timestamps: true}
)

module.exports = mongoose.model("Feedback", feedbackSchema)

