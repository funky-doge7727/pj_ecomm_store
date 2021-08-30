const express = require("express")
const Cart = require("../models/cart")
const Product = require("../models/cupcake")

const controller = express.Router()

controller.get("/", (req, res) => {
    res.render("shopping_cart.ejs")
})

controller.get("/add-to-cart/:id", async (req, res, next) => {
    
    if (req.session.username) {
    const product = await Product.findOne({cakeId: req.params.id})
    const productId = product._id
    const cart = new Cart(req.session.cart ? req.session.cart: {})

    Product.findById(productId, function(err, product) {
        if (err) {
            // console.log(err)
            return res.redirect("/")
        }
        cart.add(product, product.id)
        req.session.cart = cart
        // console.log(req.url)

        if (req.query.addOne === 'true') {
            res.redirect(`/shop`)
        } else {
            res.redirect("/shopping-cart")
        }
        
    })

    } else {
        res.redirect("/users/login")
    }
})

controller.get("/reduce/:id", async function(req, res, next) {
    const product = await Product.findOne({cakeId: req.params.id})
    const productId = product._id
    const cart = new Cart(req.session.cart ? req.session.cart: {})

    cart.reduceByOne(productId)
    req.session.cart = cart
    res.redirect('/shopping-cart')
})

controller.get("/remove/:id", async function(req, res) {
    const product = await Product.findOne({cakeId: req.params.id})
    const productId = product._id
    const cart = new Cart(req.session.cart ? req.session.cart: {})

    cart.removeItem(productId)
    req.session.cart = cart
    res.redirect("/shopping-cart")
})

module.exports = controller