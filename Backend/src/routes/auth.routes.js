const { Router } = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const passport = require("passport");

const authRouter = Router()

/**
 * @route POST/api/auth/register
 * @description register a new user
 * @access public
 */

authRouter.post("/register",authController.registerUserController)

/**
 * @route POST/api/auth/login
 * @description login existing user
 * @acces public
 */

authRouter.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in blacklist
 * @access public
 */

authRouter.get("/logout",authController.logoutUserController)

/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

// Google login
authRouter.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
authRouter.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.redirect("http://localhost:5173/dashboard");
  }
);

module.exports=authRouter