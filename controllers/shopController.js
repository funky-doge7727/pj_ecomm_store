const express = require("express")
const controller = express.Router()
const {isAuthenticatedPerson, isAuthenticatedAdmin, isAuthenticatedCustomer} = require("../models/isAuthenticatedFunc")


const mongoose = require("mongoose")
const db = mongoose.connection

const Cupcake = require("../models/cupcake")
const seedData = require("../models/seed")

async function reSeed() {
    db.dropCollection("cupcakes", () => console.log("collection dropped"))
    await Cupcake.create(seedData, (e, m) => e ? e.message: console.log("seed data created"))
}

// DANGEROUS: Uncomment below to reset database with seed data

// reSeed() 

// index route

controller.get("/", async (req, res) => {
    const cupcakes = await Cupcake.find().sort({cakeId: 1}).exec()
    res.render("shop.ejs", {cupcakes})
})

// new route

controller.get("/new", isAuthenticatedAdmin, (req, res) => {
    res.render("new.ejs")
})

// post route

controller.post("", isAuthenticatedAdmin, async (req, res) => {
    let cupcakeHighestId = 0
    console.log(await Cupcake.countDocuments())
    try {   
        if (await Cupcake.countDocuments()) {
            cupcakeHighestId = await Cupcake.find({},{cakeId: 1, "_id": 0}).sort({cakeId: -1}).limit(1).exec()
            cupcakeHighestId = cupcakeHighestId[0].cakeId + 1
        } else {
            cupcakeHighestId = 0
        }

    } catch(e) {console.log(e)}

    req.body.cakeId = cupcakeHighestId
    if (req.file) {
        req.body.imagePath = `/img/${req.file.filename}`
    } 
    console.log(req.body)
    Cupcake.create(req.body, () => console.log("creation done"))
    res.redirect("/shop?success=true&action=post")
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