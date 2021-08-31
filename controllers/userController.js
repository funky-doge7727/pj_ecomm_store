const express = require("express")
const controller = express.Router()
const bcrypt = require("bcrypt");
const User = require("../models/users");

controller.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

controller.post("/signup", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = {username: req.body.username, 
                        password: hashedPassword, 
                        usertype: 'customer',
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        address: req.body.address,
                        postalCode: req.body.postalCode,
                        phone: req.body.phone,
                        email: req.body.email}
        await User.create(newUser)
        res.redirect("/?action=success&signup=true")
    } catch (err) {
        res.redirect("/users/login?action=failed&signup=false")
    }
})


controller.get("/login", (req, res) => {
    res.render("login.ejs")
})

controller.post("/login", async (req, res) => {
    const selectedUser = await User.findOne({username: req.body.username})

    if (! selectedUser) {
        return res.send("Username does not exist")
    }

    if (bcrypt.compareSync(req.body.password, selectedUser.password)) {
        req.session.username = selectedUser.username
        req.session.usertype = selectedUser.usertype
        res.redirect("/")
    } else {
        res.send("Wrong password!")
    }
})

controller.get("/logout", (req, res) => {
    req.session.destroy(err => {
        res.clearCookie("connect.sid", { path: "/" });
        res.redirect('/?logout=true');
      })
    // res.redirect("/")
})

module.exports = controller
