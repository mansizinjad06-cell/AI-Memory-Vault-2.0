import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const logout = () => {
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#2563eb",
        color: "white",
        padding: "15px 30px",
      }}
    >
      <h2>AI Memory Vault 2.0</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        {/* BACK BUTTON */}
        <button
          onClick={goBack}
          style={{
            padding: "8px 15px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "white",
            color: "#2563eb",
            fontWeight: "bold",
          }}
        >
          ← Back
        </button>

        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/profile"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Profile
        </Link>

        <button
          onClick={logout}
          style={{
            padding: "8px 15px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#ef4444",
            color: "white",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;