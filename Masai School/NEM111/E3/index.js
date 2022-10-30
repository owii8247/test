const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserModel = require("./models/User.model")
const connection = require("./configs/db")
const notesRouter = require("./routes/notes.routes")
const app = express()
app.use(express.json())
require("dotenv").config()

//SignUp

app.post("/signup", async (req, res) => {
    const { email, password } = req.body
    await bcrypt.hash(password, 8, function (err, hash) {
        if (err) {
            return res.send("Sign Up Failed")
        }
        const user = new UserModel({ email, password: hash })
        user.save()
        return res.send("Sign Up Successfull")
    })
})


//Login 

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
        return res.send("Invalid Credentials")
    }
    const hashed_password = user.password

    await bcrypt.compare(password, hashed_password, function (err, result) {
        if (err) {
            return res.send("Please try again later")
        }
        if (result == true) {
            const token = jwt.sign({ email: user.email, _id: user._id }, process.env.jwt_secret_key)
            return res.send({ message: "Login Successfull", token: token, userId: user._id })
        }
        else {
            return res.send("Invalid Credentials")
        }
    })
})

const authenticated = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send("Please login again")
    }
    const user_token = req.headers.authorization.split(" ")[1]
    jwt.verify(user_token, process.env.jwt_secret_key, function (err, decoded) {
        if (err) {
            return res.send("Please Login Again")
        }
        console.log(decoded)
        next()
    })
}

app.use(authenticated)
app.use("/notes", notesRouter)

app.listen(8000, async () => {
    try {
        await connection
        console.log("Connected to DB Successfully")
    }
    catch (err) {
        console.log("Connecting to DB Failed")
        console.log(err)
    }
    console.log("PORT Running on 8000")
})