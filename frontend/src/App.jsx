import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  useEffect(() => {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const saveBtn = document.getElementById("saveBtn");
    const notesGrid = document.querySelector(".notes-grid");

    if (!titleInput || !contentInput || !saveBtn || !notesGrid) return;

    // Get logged-in user's email from JWT manually
    const token = localStorage.getItem("token");
    let userEmail = null;

    if (token) {
      try {
        // JWT format: header.payload.signature
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        userEmail = decoded.email;
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    if (!userEmail) {
      notesGrid.innerHTML = `
        <div class="empty-notes">
          <div class="empty-notes-icon">📝</div>
          <p>Please login to see your notes!</p>
        </div>
      `;
      return;
    }

    // Load notes for this user
    let notes = JSON.parse(localStorage.getItem(`notes_${userEmail}`)) || [];

    function saveToLocalStorage() {
      localStorage.setItem(`notes_${userEmail}`, JSON.stringify(notes));
    }

    function renderNotes() {
      if (notes.length === 0) {
        notesGrid.innerHTML = `
          <div class="empty-notes">
            <div class="empty-notes-icon">📝</div>
            <p>No notes yet. Start creating your first note!</p>
          </div>
        `;
        return;
      }

      notesGrid.innerHTML = "";
      notes.forEach((note, index) => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
          <div class="note-card-header">
            <h3>${note.title}</h3>
            <button class="note-delete-btn" data-index="${index}">🗑️</button>
          </div>
          <p>${note.content}</p>
          <div class="note-date">${note.date}</div>
        `;
        notesGrid.appendChild(noteCard);
      });

      document.querySelectorAll(".note-delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const index = parseInt(this.getAttribute("data-index"));
          notes.splice(index, 1);
          saveToLocalStorage();
          renderNotes();
        });
      });
    }

    function saveNote() {
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title && !content) return alert("Please add a title or content!");

      const note = {
        title: title || "Untitled",
        content: content,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      notes.unshift(note);
      saveToLocalStorage();
      renderNotes();
      titleInput.value = "";
      contentInput.value = "";
    }

    saveBtn.addEventListener("click", saveNote);
    renderNotes();

    return () => {
      saveBtn.removeEventListener("click", saveNote);
    };
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          📝 My Notes
        </Link>
        <div className="navbar-buttons">
          <Link to="/login">
            <button className="btn-login">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn-signup">Sign Up</button>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="note-container">
              <div className="note-app">
                <h1>📝 My Notes</h1>
                <div className="notes-layout">
                  <div className="notes-left-section">
                    <div className="input-box">
                      <input type="text" id="title" placeholder="Note title..." />
                      <textarea id="content" placeholder="Write something..."></textarea>
                      <button id="saveBtn">Save Note</button>
                    </div>
                  </div>
                  <div className="notes-right-section">
                    <div className="notes-section">
                      <h2>Your Saved Notes</h2>
                      <div className="notes-grid">
                        <div className="empty-notes">
                          <div className="empty-notes-icon">📝</div>
                          <p>No notes yet. Start creating your first note!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
