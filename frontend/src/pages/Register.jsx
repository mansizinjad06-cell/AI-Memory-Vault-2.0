import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    alert("Registration successful!");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background:
          "linear-gradient(135deg, #dbeafe, #ede9fe, #f5f3ff)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.95)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          boxSizing: "border-box",
        }}
      >
        {/* Branding */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px",
            }}
          >
            🧠
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#1E3A8A",
            }}
          >
            AI Memory Vault 2.0
          </h1>

          <p
            style={{
              color: "#6B7280",
              marginTop: "8px",
            }}
          >
            Create your personal memory vault 💙
          </p>
        </div>

        {/* Heading */}

        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Create Account ✨
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#6B7280",
            marginBottom: "25px",
          }}
        >
          Start preserving your memories today
        </p>

        {/* Full Name */}

        <label
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: "600",
          }}
        >
          👤 Full Name
        </label>

        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        {/* Email */}

        <label
          style={{
            display: "block",
            marginTop: "18px",
            marginBottom: "7px",
            fontWeight: "600",
          }}
        >
          📧 Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        {/* Password */}

        <label
          style={{
            display: "block",
            marginTop: "18px",
            marginBottom: "7px",
            fontWeight: "600",
          }}
        >
          🔒 Password
        </label>

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        {/* Register Button */}

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "25px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(90deg, #2563EB, #7C3AED)",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(37,99,235,0.3)",
          }}
        >
          🚀 Create Account
        </button>

        {/* Login Link */}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#6B7280",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#2563EB",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>

        {/* Footer */}

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "12px",
            color: "#9CA3AF",
          }}
        >
          🔒 Your memories, your private space.
        </p>
      </div>
    </div>
  );
}

export default Register;