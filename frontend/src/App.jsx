import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [notes, setNotes] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email);

      fetch("https://note-saver-c37u.onrender.com/getnotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") setNotes(data.notes);
        });
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  const saveNote = async () => {
    if (!title.trim() && !content.trim())
      return alert("Please add a title or content!");
    const token = localStorage.getItem("token");

    const note = {
      title: title.trim() || "Untitled",
      content: content.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const res = await fetch("https://note-saver-c37u.onrender.com/savenote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...note }),
    });

    const data = await res.json();
    if (data.status === "ok") {
      setNotes([note, ...notes]);
      setTitle("");
      setContent("");
    } else {
      alert(data.error || "Failed to save note");
    }
  };

  const deleteNote = async (noteId, index) => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://note-saver-c37u.onrender.com/deletenote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, noteId }),
    });

    const data = await res.json();
    if (data.status === "ok") {
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
    } else {
      alert(data.error || "Failed to delete note");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
    setNotes([]);
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">📝 My Notes</Link>

        <div className="navbar-buttons">
          {userEmail ? (
            <>
              <button className="btn-add" onClick={() => document.getElementById("title").focus()}>
                ➕
              </button>

              <div className="user-info">
                <span className="user-icon">👤</span>
                <span className="user-email">{userEmail}</span>
              </div>

              <button className="btn-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-login">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn-signup">Sign Up</button>
              </Link>
            </>
          )}
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
                    {userEmail ? (
                      <div className="input-box">
                        <input
                          type="text"
                          id="title"
                          placeholder="Note title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                          placeholder="Write something..."
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        <button type="button" id="saveBtn" onClick={saveNote}>
                          Save Note
                        </button>
                      </div>
                    ) : (
                      <p style={{ padding: "20px" }}>Please login to create notes.</p>
                    )}
                  </div>

                  <div className="notes-right-section">
                    <div className="notes-section">
                      <h2>Your Saved Notes</h2>
                      <div className="notes-grid">
                        {userEmail && notes.length === 0 && (
                          <div className="empty-notes">
                            <div className="empty-notes-icon">📝</div>
                            <p>No notes yet. Start creating your first note!</p>
                          </div>
                        )}
                        {!userEmail && (
                          <div className="empty-notes">
                            <div className="empty-notes-icon">📝</div>
                            <p>Please login to see your notes!</p>
                          </div>
                        )}
                        {notes.map((note, index) => (
                          <div className="note-card" key={note._id}>
                            <div className="note-card-header">
                              <h3>{note.title}</h3>
                              <button
                                className="note-delete-btn"
                                onClick={() => deleteNote(note._id, index)}
                              >
                                🗑️
                              </button>
                            </div>
                            <p>{note.content}</p>
                            <div className="note-date">{note.date}</div>
                          </div>
                        ))}
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
