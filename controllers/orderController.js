const express = require("express")
const controller = express.Router()

const Order = require("../models/order")

// "index" route for orders, depending on usertype. If usertype === "customer", will only show the customer's order. If usertype === "admin". will show all customers orders.

controller.get("/", async (req, res) => {
    let orderSummary = ''
    if (req.session.usertype === "customer") {
        orderSummary = await Order.find({user: req.session.username}).sort( { orderId: -1 } )
    } else if (req.session.usertype === "admin") {
        orderSummary = await Order.find({}).sort( { orderId: -1 } )
    }
    res.render("ordersSummary.ejs", {orderSummary})
})

// show route for orders

controller.get("/:id", async (req, res) => {
    const order = await Order.findOne({orderId: req.params.id}).exec()
    if (!order) {
        res.send("wrong page")
    } else {
        res.render("order_show.ejs", {order})
    }
})

// update order to fulfilled

controller.put("/fulfill-order/:id", async (req, res) => {
    await Order.updateOne({orderId: req.params.id}, {fulfilled: true, fulfilledBy: req.session.username})
    res.redirect("/order")
})

module.exports = controller