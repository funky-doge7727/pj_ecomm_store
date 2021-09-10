const express = require("express")
const controller = express.Router()
const Order = require("../models/order")
const {isAuthenticatedPerson, isAuthenticatedAdmin, isAuthenticatedCustomer} = require("../models/isAuthenticatedFunc")

// "index" route for orders, depending on usertype. If usertype === "customer", will only show the customer's order. If usertype === "admin". will show all customers orders.



controller.get("/", isAuthenticatedPerson, async (req, res) => {
    try {
        let orderSummary = ''
        if (req.session.usertype === "customer") {
            orderSummary = await Order.find({user: req.session.username}).sort( { orderId: -1 } )
            res.render("ordersSummary.ejs", {orderSummary})
        } else if (req.session.usertype === "admin") {
            orderSummary = await Order.find({}).sort( { orderId: -1 } )
            res.render("ordersSummary.ejs", {orderSummary})
        } else {
            res.redirect("/users/login")
        }
        
    } catch(e) {
        console.log(e)
        res.render("error404.ejs")
    }
})

// show route for orders

controller.get("/:id", isAuthenticatedPerson, async (req, res) => {
    const order = await Order.findOne({orderId: req.params.id}).exec()
    console.log(order.user === req.session.username)
    if (!order) {
        res.render("error404.ejs")
    } else {
        if (order.user === req.session.username || req.session.usertype === "admin") {
            res.render("order_show.ejs", {order})
        } else {
            res.render("error403.ejs")
        }
    }
})

// update order to fulfilled

controller.put("/fulfill-order/:id", isAuthenticatedAdmin, async (req, res) => {
    await Order.updateOne({orderId: req.params.id}, {fulfilled: true, fulfilledBy: req.session.username})
    res.redirect("/order")
})

module.exports = controller