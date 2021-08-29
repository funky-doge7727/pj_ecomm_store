const express = require("express")
const controller = express.Router()

const Order = require("../models/order")

controller.get("/", async (req, res) => {
    let orderSummary = ''
    if (req.session.usertype === "customer") {
        orderSummary = await Order.find({user: req.session.username})
    } else if (req.session.usertype === "admin") {
        orderSummary = await Order.find({})
    }
    res.render("ordersSummary.ejs", {orderSummary})
})

controller.put("/fulfill-order/:id", async (req, res) => {
    await Order.updateOne({orderId: req.params.id}, {fulfilled: true})
    res.redirect("/order")
    // res.render("ordersSummary.ejs", {orderSummary})
})

module.exports = controller