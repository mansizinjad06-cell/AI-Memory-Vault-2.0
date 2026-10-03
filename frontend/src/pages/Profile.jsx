import { useContext, useState } from "react";
import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";

function Profile() {
  const { photos, notes, documents, voiceNotes } =
    useContext(MemoryContext);

  const [name, setName] = useState("Mansi Zinjad");
  const [email, setEmail] = useState("mansi@example.com");

  const [editMode, setEditMode] = useState(false);

  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);

  const totalMemory =
    photos.length +
    notes.length +
    documents.length +
    voiceNotes.length;

  const saveProfile = () => {
    if (
      editName.trim() === "" ||
      editEmail.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    setName(editName.trim());
    setEmail(editEmail.trim());

    setEditMode(false);

    alert("Profile updated successfully!");
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* Profile Image */}

        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            marginBottom: "20px",
          }}
        />

        {/* Profile Information */}

        {!editMode ? (
          <>
            <h2>{name}</h2>

            <p
              style={{
                color: "gray",
                fontSize: "16px",
              }}
            >
              📧 {email}
            </p>

            <button
              onClick={() => {
                setEditName(name);
                setEditEmail(email);
                setEditMode(true);
              }}
              style={{
                marginTop: "20px",
                padding: "10px 25px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <h2>Edit Profile</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "80%",
                padding: "12px",
                marginTop: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />

            <br />

            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: "80%",
                padding: "12px",
                marginTop: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />

            <br />

            <button
              onClick={saveProfile}
              style={{
                marginTop: "20px",
                marginRight: "10px",
                padding: "10px 25px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              💾 Save
            </button>

            <button
              onClick={() => {
                setEditMode(false);
                setEditName(name);
                setEditEmail(email);
              }}
              style={{
                padding: "10px 25px",
                background: "#6b7280",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}

        <hr style={{ margin: "30px 0" }} />

        {/* Memory Statistics */}

        <h3>📊 Memory Statistics</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "15px",
              background: "#EFF6FF",
              borderRadius: "10px",
            }}
          >
            <h3>📷</h3>
            <p>Photos</p>
            <h2>{photos.length}</h2>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#ECFDF5",
              borderRadius: "10px",
            }}
          >
            <h3>📝</h3>
            <p>Notes</p>
            <h2>{notes.length}</h2>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#FEF3C7",
              borderRadius: "10px",
            }}
          >
            <h3>📄</h3>
            <p>Documents</p>
            <h2>{documents.length}</h2>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#F3E8FF",
              borderRadius: "10px",
            }}
          >
            <h3>🎤</h3>
            <p>Voice Notes</p>
            <h2>{voiceNotes.length}</h2>
          </div>
        </div>

        <hr style={{ margin: "30px 0" }} />

        {/* Total Memories */}

        <h3>🧠 Total Memories</h3>

        <h1
          style={{
            fontSize: "45px",
            color: "#2563eb",
            margin: "10px 0",
          }}
        >
          {totalMemory}
        </h1>

        <p style={{ color: "gray" }}>
          Total memories stored in your vault
        </p>
      </div>
    </div>
  );
}

export default Profile;