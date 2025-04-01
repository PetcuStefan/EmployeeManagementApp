const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users");  // ✅ Import the Sequelize User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          return done(null, user); // ✅ User exists
        } else {
          // Insert new user
          const newUser = await User.create({
            email: profile.emails[0].value,
            googleId: profile.id,
            displayName: profile.displayName,
          });

          return done(null, newUser);
        }
      } catch (err) {
        console.error("🔴 OAuth Error:", err);  // ✅ Logs detailed error info
        return done(err, null);
      }
    }
  )
);

// ✅ Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.user_id);  // Use `user_id` from Sequelize model
});

// ✅ Deserialize user (retrieve user from DB)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);  // Use Sequelize's `findByPk`
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
