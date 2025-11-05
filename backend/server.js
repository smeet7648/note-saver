const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// ✅ CORS setup (you can later restrict the origin to your Netlify domain)
app.use(
  cors({
    origin: "https://note-saver-c37u.onrender.com/",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Temporary in-memory data
const users = [];
const notes = [];

const SECRET_KEY =
  "9babb0e332d01547d276b1c0a6b07752834e0ea850999f2af956efebecdd3314855020a82780a75b9c00fa8cf77a300ed0c115f5b73223181d8a037d654583af";

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password, cfpassword } = req.body;

  if (password !== cfpassword) {
    return res.json({ status: "error", error: "Passwords do not match" });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.json({ status: "error", error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword };
  users.push(user);
  res.json({ status: "ok" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.json({ status: "error", error: "Invalid credentials" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.json({ status: "error", error: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, SECRET_KEY);
  res.json({ status: "ok", token });
});

// SAVE NOTE
app.post("/savenote", (req, res) => {
  const { token, title, content } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;

    const note = {
      userEmail,
      title,
      content,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    notes.push(note);
    res.json({ status: "ok", message: "Note saved!" });
  } catch (err) {
    res.json({ status: "error", error: "Invalid token" });
  }
});

// GET NOTES
app.post("/getnotes", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userEmail = decoded.email;
    const userNotes = notes.filter((n) => n.userEmail === userEmail);
    res.json({ status: "ok", notes: userNotes });
  } catch (err) {
    res.json({ status: "error", error: "Invalid token" });
  }
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
