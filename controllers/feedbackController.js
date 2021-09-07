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

// DANGEROUS: Uncomment below to reset database with seed data

// reSeed() 

// post route

controller.post("", async (req, res) => {
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

// put route

controller.put("/:id", isAuthenticatedAdmin, async (req, res) => {
    if (req.file) {
        req.body.imagePath = `img/${req.file.filename}`
    } else {
        const originalCupcake = await Cupcake.findOne({cakeId: Number(req.params.id)}).exec()
        const oriImg = originalCupcake.imagePath
        req.body.imagePath = oriImg
    }
    await Cupcake.updateOne({cakeId: req.params.id}, req.body).exec()
    res.redirect(`/shop/${req.params.id}`)
})

controller.put("/:id/decreQty", async (req, res) => {
    try { 
        await Cupcake.updateOne({cakeId: req.params.id}, {$inc: {quantity: -1}}).exec()
        res.redirect(`/shop/${req.params.id}`)
    } catch {res.send("invalid option")}
})


// edit 

controller.get("/:id/edit", isAuthenticatedAdmin, async (req, res)=> {
    const cupcake = await Cupcake.findOne({cakeId: req.params.id}).exec()
    res.render("edit.ejs", {cupcake})
})


// delete

controller.delete("/:id", isAuthenticatedAdmin, async (req, res) => {
    await Cupcake.deleteOne({cakeId: req.params.id})
    res.redirect("/shop")
})

// show

controller.get("/:id", async (req, res) => {
    const cupcake = await Cupcake.findOne({cakeId: Number(req.params.id)}).exec()
    res.render("show.ejs", {cupcake})
})

module.exports = controller