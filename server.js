require("dotenv").config()

const express = require("express")
const app = express()
const PORT = process.env.PORT

const methodOverride = require("method-override")
const seedData = require("./models/seed.js")
const multer = require("multer")
const session = require("express-session")
const MongoStore = require("connect-mongo")

app.use(express.static("public"))
app.use(methodOverride("_method"));

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ '--' + file.originalname)
    }
})

const upload = multer({storage: fileStorageEngine})
app.use(upload.single("imagePath"));

// body parsers

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// setup mongo db

const mongoose = require("mongoose")
const db = mongoose.connection

const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})

db.on("connected", () => console.log("my database is connected"))
db.on("error", err => console.log(err.message))
db.on("disconnected", () => console.log("my database is disconnected"))


async function reSeed() {
    db.dropCollection("cupcakes", () => console.log("collection dropped"))
    await Cupcake.create(seedData, (e, m) => e ? e.message: console.log("seed data created"))
}

// reSeed()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoURI,
        ttl: 1 * 24 * 60 * 60 // BUG: cookies doesn't expire
    }),
  }))
  
  app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.usertype = req.session.usertype;
    res.locals.session = req.session
    next();
  })

// controller setup

const homepageController = require("./controllers/homepageController");
const shopController = require("./controllers/shopController")
const userController = require("./controllers/userController")
const contactusController = require("./controllers/contactusController")
const shoppingcartController = require("./controllers/shoppingcartController")

// CONTROLLERS

app.use(homepageController)
app.use("/shop", shopController)
app.use("/users", userController)
app.use("/contact-us", contactusController)
app.use("/shopping-cart", shoppingcartController)

app.get("*", (req, res) => res.send("wrong page"))

// listener

app.listen(PORT, console.log("Listening to port", PORT))