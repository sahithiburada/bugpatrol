const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bugRoutes=require("./routes/bugRoutes")
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
app.use(express.json());
const session = require('express-session');
const authorityRoutes = require('./routes/authorityRoutes');

app.use(cors({
  origin: 'http://localhost:3000', // 👈 exact origin, not '*'
  credentials: true               // 👈 allow credentials
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    httpOnly: true
  }
}));

connectDB();

// ... your other routes

// Use routes
app.use('/api/profile', profileRoutes);

app.use(express.json());
app.use('/api/authority', authorityRoutes);
app.use("/api/auth", require("./routes/authroutes"));
app.use('/api/issues', bugRoutes);
app.use("/api/otp", require("./routes/otpRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
