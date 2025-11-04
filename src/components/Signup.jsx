import React from "react";
import { Link } from "react-router-dom";
import "./style1.css";

function Signup() {

  async function Signup(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const cfpassword = document.getElementById("confirmPassword").value;

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        cfpassword,
      }),
    });

    const data = await res.json();
    if (data.status === "ok") {
      alert("Signup successful");
      window.location.href = "/Login";
    } else {
      alert(data.error);
    }
  }
  return (
    <div className="signup-container">
      {/* Animated Background Circles */}
      <div className="signup-bg-decoration">
        <div className="signup-circle signup-circle-1"></div>
        <div className="signup-circle signup-circle-2"></div>
        <div className="signup-circle signup-circle-3"></div>
      </div>

      {/* SignUp Card */}
      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1>Create Account</h1>
          <p>Join us and start your journey today 🚀</p>
        </div>

        {/* Form */}
        <form className="signup-form">
          <div className="signup-form-group">
            <label>Full Name</label>
            <div className="signup-input-wrapper">
              <span className="signup-input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M5.121 17.804A9 9 0 1118.878 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <input type="text" placeholder="Enter your full name" id="name" />
            </div>
          </div>

          <div className="signup-form-group">
            <label>Email Address</label>
            <div className="signup-input-wrapper">
              <span className="signup-input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 12H8m8 4H8m2-8h8m4 0v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l6 6z"
                  />
                </svg>
              </span>
              <input type="email" placeholder="Enter your email" id="email" />
            </div>
          </div>

          <div className="signup-form-group">
            <label>Password</label>
            <div className="signup-input-wrapper">
              <span className="signup-input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 15v2m0-8a4 4 0 014 4v2a4 4 0 01-8 0v-2a4 4 0 014-4z"
                  />
                </svg>
              </span>
              <input type="password" placeholder="Create a password" id="password" />
            </div>
          </div>

          <div className="signup-form-group">
            <label>Confirm Password</label>
            <div className="signup-input-wrapper">
              <span className="signup-input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 15v2m0-8a4 4 0 014 4v2a4 4 0 01-8 0v-2a4 4 0 014-4z"
                  />
                </svg>
              </span>
              <input type="password" placeholder="Confirm password" id="confirmPassword" />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-btn" onClick={Signup}>
            Create Account
          </button>

          {/* Divider */}
          <div className="signup-divider">
            <span>OR</span>
          </div>

          {/* Social Signup */}
          <div className="signup-social">
            <button type="button" className="social-signup-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              Continue with Google
            </button>

            <button type="button" className="social-signup-btn">
              <img
                src="https://www.svgrepo.com/show/349375/github.svg"
                alt="GitHub"
              />
              Continue with GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="signup-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
