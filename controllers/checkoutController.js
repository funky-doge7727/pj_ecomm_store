const express = require("express")
const Order = require("../models/order")
const Cupcake = require("../models/cupcake")
const User = require("../models/users")
const {isAuthenticatedPerson, isAuthenticatedAdmin, isAuthenticatedCustomer} = require("../models/isAuthenticatedFunc")
const controller = express.Router()

controller.get("/", isAuthenticatedCustomer, (req, res) => {
    if (req.query.option === "different-address") {
        res.render("checkout-different-address.ejs")
    } else {
        res.render("checkout.ejs")
    }

})


controller.post("/order-success", isAuthenticatedCustomer, async (req, res) => {

    if (req.session.cart.totalQty > 0) {
        let quantityExceedOrder = false
        let order = ""

        order = new Order({
            orderId: await Order.countDocuments() + 3000,
            user: req.session.username,
            cart: req.session.cart,
            firstName: req.query.option === "different-address" ? req.body.firstName : (await User.findOne({username: req.session.username})).firstName,
            lastName: req.query.option === "different-address" ? req.body.lastName : (await User.findOne({username: req.session.username})).lastName,
            address: req.query.option === "different-address" ? req.body.address : (await User.findOne({username: req.session.username})).address,
            postalCode: req.query.option === "different-address" ? req.body.postalCode : (await User.findOne({username: req.session.username})).postalCode,
            phone: req.query.option === "different-address" ? req.body.phone : (await User.findOne({username: req.session.username})).phone,
            email: req.query.option === "different-address" ? req.body.email : (await User.findOne({username: req.session.username})).email,
            notes: req.body.notes,
            fulfilled: false
        })

        // quantity availability check. If any ordered item in the cart exceeds the quantity available in stock, the entire cart will be rejected (i.e. not checked-out) and user will have to re-edit the cart with the appropriate quantity.
        for (const element of Object.values(req.session.cart.items)) {
            const cupcake = await Cupcake.findOne({cakeId: element.item.cakeId})
            if (cupcake.quantity<element.qty) {
                quantityExceedOrder = true
                break
            }
        }


        // quantity reduction function

        if (!quantityExceedOrder) {
            for (const element of Object.values(req.session.cart.items)) {
                await Cupcake.updateOne({cakeId: element.item.cakeId}, {$inc: { quantity: -element.qty}})
                // console.log(`Cake Id ${element.item.cakeId} is decreased by ${element.qty}`)
            }
            await Order.create(order, () => console.log('creation done!')) 
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            
            res.render("order_success.ejs")
        } else {
            res.redirect("/shopping-cart?quantityExceedOrder=true")
        }

    } else {
        console.log("invalid input")
        res.render("index.ejs")
    }
})

module.exports = controller
