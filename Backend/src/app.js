const express = require('express');
const cookieParser = require("cookie-parser")
const session = require("express-session");
const passport = require("./config/passport");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: "https://interview-ai-one-psi.vercel.app",
  credentials: true
}))

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes") 

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter) 

module.exports = app;
