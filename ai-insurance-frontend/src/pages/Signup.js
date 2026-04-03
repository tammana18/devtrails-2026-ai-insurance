import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMsg("Name, email and password are required ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password: password.trim() 
        })
      });

      const data = await res.json();
      console.log("SIGNUP RESPONSE:", data);

      // Support both response shapes: { user: {...} } and direct user object.
      const signupSuccess = res.ok && (data?.user || data?._id || data?.email || data?.name);

      if (signupSuccess) {
        setMsg("Signup success ✅ Redirecting to login...");
        
        // ✅ Clear form
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else {
        setMsg(data.message || "Signup failed ❌");
      }

    } catch (error) {
      console.error(error);
      setMsg("Error connecting to server ❌");
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
      <h1 className="auth-title">Signup 📝</h1>

      <input
        className="auth-input"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
      />

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
        onClick={handleSignup}
      >
        Signup
      </button>

      <h3 className="auth-message">{msg}</h3>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      </div>
    </div>
  );
}

export default Signup;