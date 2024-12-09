const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/model.user'); 
const jwt = require('jsonwebtoken');


<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "895008070474-gmt0juck2a2m0kem73tkviir3ibmrh4r.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "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";
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://107.22.157.99/api/users/google/callback";

passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google Profile Data:", profile);
  
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          });
  
          if (!user) {
            console.log("Saving user to database...");
            user = await User.create({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              googleId: profile.id,
              googleToken: accessToken,
              role: "user",
            });
            console.log("User saved successfully:", user);
          } else {
            console.log("User already exists:", user);
          }
  
          return done(null, user);
        } catch (error) {
          console.error("Error during Google OAuth:", error);
          return done(error);
        }
      }
    )
  );
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
