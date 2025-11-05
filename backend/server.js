// ======================
// Import Dependencies
// ======================
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// ======================
// App Initialization
// ======================
const app = express();

// ======================
// MongoDB Local Connection
// ======================
mongoose.connect("mongodb://localhost:27017/notesApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
db.once("open", () => {
  console.log("✅ Connected to MongoDB successfully!");
});

// ======================
// Middleware
// ======================
app.use(
  cors({
    origin: "https://shimmering-lamington-6eec95.netlify.app", // your frontend URL
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// ======================
// Secret Key for JWT
// ======================
const SECRET_KEY =
  "9babb0e332d01547d276b1c0a6b07752834e0ea850999f2af956efebecdd3314855020a82780a75b9c00fa8cf77a300ed0c115f5b73223181d8a037d654583af";

// ======================
// MongoDB Schemas & Models
// ======================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const noteSchema = new mongoose.Schema({
  userEmail: String,
  title: String,
  content: String,
  date: String,
});

const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

// ======================
// Routes
// ======================

// 🟢 SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password, cfpassword } = req.body;

  try {
    if (password !== cfpassword) {
      return res.json({ status: "error", error: "Passwords do not match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ status: "error", error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ status: "ok", message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.json({ status: "error", error: "Server error" });
  }
});

// 🟢 LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ status: "error", error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ status: "error", error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, SECRET_KEY);
    res.json({ status: "ok", token });
  } catch (error) {
    console.error("Login error:", error);
    res.json({ status: "error", error: "Server error" });
  }
});

// 🟢 SAVE NOTE
app.post("/savenote", async (req, res) => {
  const { token, title, content } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    const note = new Note({
      userEmail,
      title,
      content,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    await note.save();
    res.json({ status: "ok", message: "Note saved!" });
  } catch (err) {
    console.error("Save note error:", err);
    res.json({ status: "error", error: "Invalid or expired token" });
  }
});

// 🟢 GET NOTES
app.post("/getnotes", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    const userNotes = await Note.find({ userEmail });
    res.json({ status: "ok", notes: userNotes });
  } catch (err) {
    console.error("Get notes error:", err);
    res.json({ status: "error", error: "Invalid or expired token" });
  }
});

// ======================
// Server Startup
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
