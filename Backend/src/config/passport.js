const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/users.model");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {

  let user = await userModel.findOne({ email: profile.emails[0].value });

  if (!user) {
    user = await userModel.create({
      username: profile.displayName,
      email: profile.emails[0].value,
      password: "GOOGLE_AUTH" // dummy
    });
  }

  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user._id); // store only user id
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await require("../models/users.model").findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;