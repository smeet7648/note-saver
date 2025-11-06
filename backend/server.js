const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS setup (Netlify frontend allowed)
app.use(
  cors({
    origin: "https://shimmering-lamington-6eec95.netlify.app",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// ✅ MongoDB Connection (works both locally & on Render)
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/noteSaver";

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
const SECRET_KEY =
  process.env.SECRET_KEY ||
  "9babb0e332d01547d276b1c0a6b07752834e0ea850999f2af956efebecdd3314855020a82780a75b9c00fa8cf77a300ed0c115f5b73223181d8a037d654583af";

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
    res.json({ status: "error", error: "Invalid token" });
  }
});

// ✅ GET NOTES
app.post("/getnotes", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    const userNotes = await Note.find({ userEmail });
    res.json({ status: "ok", notes: userNotes });
  } catch (err) {
    res.json({ status: "error", error: "Invalid token" });
  }
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
