require("dotenv").config()

const express = require("express")
const controller = express.Router()
const User = require("../models/users")


controller.get("/", async (req, res) => {
    let name = ""
    let email = ""
    if (req.session.username) {
        name = await User.findOne({username: req.session.username}, {firstName: 1, lastName: 1, email: 1, "_id": 0})
        email = name.email
        name = name.firstName + " " + name.lastName
    }
    res.render("contact_us.ejs", {goog_map: process.env.GOOG_MAP_API_KEY, name, email})
})

module.exports = controller