const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./models/sequelize");

dotenv.config();
require("./config/passport"); // Load passport config

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/companies", require("./routes/companiesRoutes"));
app.use("/api/companyDetails", require("./routes/companyDetailsRoutes"));
app.use("/api/hierarchicalStructure", require("./routes/hierarchicalStructureRoutes"));
app.use("/api/employeeProfile", require("./routes/employeeProfileRoutes"));
app.use("/api/statsRoutes", require("./routes/statsRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
console.log('Server Time Zone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection failed:", err));

sequelize.sync();  // Ensure tables are created