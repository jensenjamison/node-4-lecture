const express = require("express");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(express.json());

const movies = [];
let id = 0;

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}))

app.post("/auth/login", (req, res) => {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
})

//MIDDLEWARE
app.use(function authenticateUser(req, res, next) {
    // if(req.body.username === process.env.POST_USERNAME && req.body.password === process.env.POST_PASSWORD) {
    //     next();
    // } else {
    //     res.status(403).json({
    //         message: "Invalid Username or Password"
    //     })
    // }
    if(req.session.username !== undefined && req.session.password !== undefined) {
        if(req.session.username === process.env.POST_NAME && req.session.password === process.env.POST_PASSWORD) {
            next();
        }
    } else {
        res.status(500).json("Please log in");
    }
});

app.get("/api/movies", (req, res) => {
    res.status(200).json(movies);
})

app.post("/api/movies", (req, res) => {
    const {title, duration, genre} = req.body;
    movies.push({
        title,
        duration,
        genre,
        id
    });
    id++;
    res.status(200).json(movies);
})
app.put("/api/movies/:id", (req, res) => {
    const {title, duration, genre} = req.body;
    const {id} = req.params;
    const index = movies.findIndex((val) => {
        return val.id == id;
    })
    movies[index] = {
        title,
        duration,
        genre,
        id
    }
    res.status(200).json(movies);
})
app.delete("/api/movies/:id", (req, res) => {
    const {id} = req.params;
    const index = movies.findIndex((val) => {
        return val.id == id;
    })
    movies.splice(index, 1);
    res.status(200).json(movies);
})

app.listen(5050, () => console.log(`Listening on Port 5050`));