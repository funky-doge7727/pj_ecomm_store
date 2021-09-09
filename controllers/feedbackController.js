const express = require("express")
const controller = express.Router()
const {isAuthenticatedPerson, isAuthenticatedAdmin, isAuthenticatedCustomer} = require("../models/isAuthenticatedFunc")


const mongoose = require("mongoose")
const db = mongoose.connection

const User = require("../models/users")
const Feedback = require("../models/feedback")
// const seedData = require("../models/seed")

async function reSeed() {
    db.dropCollection("cupcakes", () => console.log("collection dropped"))
    await Cupcake.create(seedData, (e, m) => e ? e.message: console.log("seed data created"))
}

// index route

controller.get("/feedbackSummary", isAuthenticatedAdmin, async (req, res) => {
    const feedbackSummary = await Feedback.find().sort({feedbackId: -1}).exec()
    res.render("feedback_index.ejs", {feedbackSummary})
})

// post route

controller.post("", isAuthenticatedCustomer, async (req, res) => {
    let feedbackHighestId = 0
    console.log(await Feedback.countDocuments())
    try {   
        if (await Feedback.countDocuments()) {
            feedbackHighestId = await Feedback.find({},{feedbackId: 1, "_id": 0}).sort({feedbackId: -1}).limit(1).exec()
            feedbackHighestId = feedbackHighestId[0].feedbackId + 1
        } 
    } catch(e) {console.log(e)}

    req.body.feedbackId = feedbackHighestId
    if (req.session.username) {
        const name = await User.findOne({username: req.session.username}, {firstName: 1, lastName: 1, email: 1,"_id": 0})
        req.body.name = name.firstName + " " + name.lastName
        req.body.email = name.email
    }
    console.log(req.body)
    Feedback.create(req.body, () => console.log("feedback posted"))

    res.redirect("/?success=true&action=feedback")
})

module.exports = controller
