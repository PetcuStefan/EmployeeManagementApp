const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models/index"); // Import MySQL connection

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in the 'users' table (not 'userdb')
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
          profile.emails[0].value,
        ]);

        if (user.length > 0) {
          return done(null, user[0]); // User exists, log them in
        } else {
          // Insert new user
          const [result] = await db.query(
            "INSERT INTO users (email, googleId, displayName) VALUES (?, ?, ?)",
            [profile.emails[0].value, profile.id, profile.displayName]
          );

          const newUser = { id: result.insertId, email: profile.emails[0].value, displayName: profile.displayName };
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, user[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
