const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS setup for localhost frontend
app.use(
  cors({
    origin:[ "https://note-saver-3.onrender.com",
           "http://localhost:5173"],

    
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/noteSaver";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(
      `✅ Connected to MongoDB (${MONGO_URL.includes("localhost") ? "Local" : "Cloud"})`
    )
  )
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const NoteSchema = new mongoose.Schema({
  userEmail: String,
  title: String,
  content: String,
  date: String,
});

const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);

// ✅ Secret Key
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password, cfpassword } = req.body;

  if (password !== cfpassword) {
    return res.json({ status: "error", error: "Passwords do not match" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.json({ status: "error", error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });

  res.json({ status: "ok" });
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ status: "error", error: "Invalid credentials" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.json({ status: "error", error: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, SECRET_KEY);
  res.json({ status: "ok", token });
});

// ✅ SAVE NOTE
app.post("/savenote", async (req, res) => {
  const { token, title, content, date } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    const note = new Note({
      userEmail,
      title,
      content,
      date,
    });

    await note.save();
    res.json({ status: "ok", message: "Note saved!" });
  } catch (err) {
    res.json({ status: "error", error: "Invalid token" });
  }
});

// ✅ GET NOTES
app.post("/getnotes", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    const userNotes = await Note.find({ userEmail }).sort({ _id: -1 });
    res.json({ status: "ok", notes: userNotes });
  } catch (err) {
    res.json({ status: "error", error: "Invalid token" });
  }
});

// ✅ DELETE NOTE
app.post("/deletenote", async (req, res) => {
  const { token, noteId } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    await Note.deleteOne({ _id: noteId, userEmail });
    res.json({ status: "ok", message: "Note deleted!" });
  } catch (err) {
    res.json({ status: "error", error: "Invalid token or note" });
  }
});

// ✅ Dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
