const express = require("express")
const Order = require("../models/order")
const Cupcake = require("../models/cupcake")


const controller = express.Router()


controller.get("/", (req, res) => {
    res.render("checkout.ejs")
})

controller.post("/order-success", async (req, res) => {
    if (req.session.cart.totalQty > 0) {
        const order = new Order({
            orderId: await Order.countDocuments() + 3000,
            user: req.session.username,
            cart: req.session.cart,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            postalCode: req.body.postalCode,
            phone: req.body.phone,
            email: req.body.email,
            notes: req.body.notes,
            fulfilled: false
        })
        Order.create(order, () => console.log('creation done!'))
        // to insert quantity reduction function
        req.session.cart = {items: {}, totalQty: 0, totalPrice: 0}
        res.render("order_success.ejs")
    } else {
        console.log("invalid input")
        res.render("index.ejs")
    }


})

module.exports = controller