import React from "react";
import { Link } from "react-router-dom";
import "./style1.css"; // make sure this path matches your CSS filename

function Login() {

  async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("https://note-saver-c37u.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    if (data.status === "ok") {
      localStorage.setItem("token", data.token); // ✅ store JWT
      window.location.href = "/";
    }
    else{
      alert("invalid credentials");
    }
  }
  return (
    <div className="login-container">
      {/* Animated Background Circles */}
      <div className="login-bg-decoration">
        <div className="login-circle login-circle-1"></div>
        <div className="login-circle login-circle-2"></div>
        <div className="login-circle login-circle-3"></div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
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
                d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z"
              />
            </svg>
          </div>
          <h1>Welcome Back</h1>
          <p>Login to continue your journey 🚀</p>
        </div>

        {/* Login Form */}
        <form className="login-form">
          <div className="login-form-group">
            <label>Email Address</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
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

          <div className="login-form-group">
            <label>Password</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
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
              <input type="password" placeholder="Enter your password" id="password" />
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="#" className="login-forgot">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-btn" onClick={login}>
            Login
          </button>

          {/* Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Social Login */}
          <div className="login-social">
            <button type="button" className="social-login-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              Continue with Google
            </button>

            <button type="button" className="social-login-btn">
              <img
                src="https://www.svgrepo.com/show/349375/github.svg"
                alt="GitHub"
              />
              Continue with GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="login-footer">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
