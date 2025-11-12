import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  let notes = [];
  let title = "";
  let content = "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usernameEl = document.getElementById("usernameDisplay");
    const loginBtns = document.getElementById("loginBtns");
    const logoutBtn = document.getElementById("logoutBtn");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const username = payload.name || payload.email.split("@")[0];

        if (usernameEl) {
          usernameEl.innerText = `👋 Hello, ${username}`;
          usernameEl.style.display = "block";
        }
        if (loginBtns) loginBtns.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";

        // fetch notes
        fetch("https://note-saver-c37u.onrender.com/getnotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "ok") {
              notes = data.notes;
              displayNotes(notes);
            }
          });
      } catch (err) {
        console.error("Invalid token:", err);
      }
    } else {
      if (usernameEl) usernameEl.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (loginBtns) loginBtns.style.display = "flex";
    }
  }, []);

  function displayNotes(notesArr) {
    const grid = document.getElementById("notesGrid");
    if (!grid) return;

    grid.innerHTML = "";

    if (!localStorage.getItem("token")) {
      grid.innerHTML = `
        <div class="empty-notes">
          <div class="empty-notes-icon">📝</div>
          <p>Please login to see your notes!</p>
        </div>`;
      return;
    }

    if (notesArr.length === 0) {
      grid.innerHTML = `
        <div class="empty-notes">
          <div class="empty-notes-icon">📝</div>
          <p>No notes yet. Start creating your first note!</p>
        </div>`;
      return;
    }

    notesArr.forEach((note, index) => {
      const div = document.createElement("div");
      div.className = "note-card";
      div.innerHTML = `
        <div class="note-card-header">
          <h3>${note.title}</h3>
          <button class="note-delete-btn" data-id="${note._id}" data-index="${index}">🗑️</button>
        </div>
        <p>${note.content}</p>
        <div class="note-date"> ${note.date}</div>
      `;
      grid.appendChild(div);
    });

    document.querySelectorAll(".note-delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const token = localStorage.getItem("token");
        const noteId = e.target.getAttribute("data-id");
        const index = e.target.getAttribute("data-index");

        const res = await fetch("https://note-saver-c37u.onrender.com/deletenote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, noteId }),
        });

        const data = await res.json();
        if (data.status === "ok") {
          notes.splice(index, 1);
          displayNotes(notes);
        } else {
          alert(data.error || "Failed to delete note");
        }
      });
    });
  }

  async function saveNote() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");

    const note = {
      title: titleInput.value.trim() || "Untitled",
      content: contentInput.value.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    if (!note.title && !note.content) {
      alert("Please add a title or content!");
      return;
    }

    const res = await fetch("https://note-saver-c37u.onrender.com/savenote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...note }),
    });

    const data = await res.json();
    if (data.status === "ok") {
      notes.unshift(note);
      displayNotes(notes);
      titleInput.value = "";
      contentInput.value = "";
    } else {
      alert(data.error || "Failed to save note");
    }
  }

  function logoutUser() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">📝 My Notes</Link>

        <div id="usernameDisplay" style={{ display: "none", color: "white", fontWeight: "600" }}></div>

        <div className="navbar-buttons" id="loginBtns">
          <Link to="/login"><button className="btn-login">Login</button></Link>
          <Link to="/signup"><button className="btn-signup">Sign Up</button></Link>
        </div>

        <button
          id="logoutBtn"
          style={{
            display: "none",
            background: "white",
            color: "#667eea",
            padding: "12px 25px",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
          }}
          onClick={logoutUser}
        >
          Logout
        </button>
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
                      <textarea placeholder="Write something..." id="content"></textarea>
                      <button type="button" id="saveBtn" onClick={saveNote}>Save Note</button>
                    </div>
                  </div>
                  <div className="notes-right-section">
                    <div className="notes-section">
                      <h2>Your Saved Notes</h2>
                      <div id="notesGrid" className="notes-grid"></div>
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
