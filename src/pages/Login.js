import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setMsg("Email and password are required ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim() 
        })
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.token) {
        // ✅ Save token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Show message
        setMsg("Login success ✅");

        // ✅ Clear form
        setEmail("");
        setPassword("");

        // ✅ Redirect after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);

      } else {
        setMsg(data.message || "Login failed ❌");
      }

    } catch (err) {
      console.error(err);
      setMsg("Error connecting to backend ❌");
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
      <h1 className="auth-title">Login 🔐</h1>

      <input
        className="auth-input"
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <button
        className="auth-button"
        onClick={handleLogin}
      >
        Login
      </button>

      <h3 className="auth-message">{msg}</h3>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/signup">Signup here</Link>
      </p>
      </div>
    </div>
  );
}

export default Login;