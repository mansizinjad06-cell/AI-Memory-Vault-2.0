import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";

function Search() {
  const {
    photos,
    notes,
    documents,
    voiceNotes,
  } = useContext(MemoryContext);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const searchText = search.toLowerCase().trim();

  // =========================
  // FILTER PHOTOS
  // =========================

  const filteredPhotos = photos.filter((photo) =>
    (
      photo.caption ||
      photo.name ||
      "Untitled Photo"
    )
      .toLowerCase()
      .includes(searchText)
  );

  // =========================
  // FILTER NOTES
  // =========================

  const filteredNotes = notes.filter((note) =>
    (
      note.content ||
      note.title ||
      ""
    )
      .toLowerCase()
      .includes(searchText)
  );

  // =========================
  // FILTER DOCUMENTS
  // =========================

  const filteredDocuments = documents.filter((doc) =>
    (
      doc.name ||
      doc.title ||
      "Untitled Document"
    )
      .toLowerCase()
      .includes(searchText)
  );

  // =========================
  // FILTER VOICE NOTES
  // =========================

  const filteredVoiceNotes = voiceNotes.filter((voice) =>
    (
      voice.title ||
      "Untitled Voice Note"
    )
      .toLowerCase()
      .includes(searchText)
  );

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🔍 Search Your Memories
        </h1>

        <br />

        {/* SEARCH INPUT */}

        <input
          type="text"
          placeholder="Search photos, notes, documents, voice notes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <br />
        <br />

        {/* =========================
            PHOTOS
        ========================= */}

        <h2>📷 Photos</h2>

        {filteredPhotos.length === 0 ? (
          <p>No Photos Found</p>
        ) : (
          filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() =>
                navigate(
                  `/photos?photoId=${photo.id}`
                )
              }
              style={{
                marginBottom: "20px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={photo.image}
                alt={
                  photo.caption ||
                  photo.name ||
                  "Memory"
                }
                width="200"
                style={{
                  borderRadius: "10px",
                  maxHeight: "150px",
                  objectFit: "cover",
                }}
              />

              <h3>
                {photo.caption ||
                  photo.name ||
                  "Untitled Photo"}
              </h3>

              <p
                style={{
                  color: "#2563EB",
                }}
              >
                Click to open photo →
              </p>
            </div>
          ))
        )}

        <hr />

        {/* =========================
            NOTES
        ========================= */}

        <h2>📝 Notes</h2>

        {filteredNotes.length === 0 ? (
          <p>No Notes Found</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() =>
                navigate(
                  `/notes?noteId=${note.id}`
                )
              }
              style={{
                marginBottom: "15px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <h3>
                {note.title ||
                  "Untitled Note"}
              </h3>

              <p>
                {note.content || ""}
              </p>

              <p
                style={{
                  color: "#2563EB",
                }}
              >
                Click to open note →
              </p>
            </div>
          ))
        )}

        <hr />

        {/* =========================
            DOCUMENTS
        ========================= */}

        <h2>📄 Documents</h2>

        {filteredDocuments.length === 0 ? (
          <p>No Documents Found</p>
        ) : (
          filteredDocuments.map((doc) => {
            const documentName =
              doc.name ||
              doc.title ||
              "Untitled Document";

            return (
              <div
                key={doc.id}
                onClick={() =>
                  navigate(
                    `/documents?documentId=${doc.id}`
                  )
                }
                style={{
                  marginBottom: "15px",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <h3>
                  📄 {documentName}
                </h3>

                <p
                  style={{
                    color: "#2563EB",
                  }}
                >
                  Click to open document →
                </p>
              </div>
            );
          })
        )}

        <hr />

        {/* =========================
            VOICE NOTES
        ========================= */}

        <h2>🎤 Voice Notes</h2>

        {filteredVoiceNotes.length === 0 ? (
          <p>No Voice Notes Found</p>
        ) : (
          filteredVoiceNotes.map((voice) => (
            <div
              key={voice.id}
              onClick={() =>
                navigate(
                  `/voice?voiceId=${voice.id}`
                )
              }
              style={{
                marginBottom: "20px",
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <h3>
                {voice.title ||
                  "Untitled Voice Note"}
              </h3>

              <p>
                {voice.createdAt}
              </p>

              <audio
                controls
                src={voice.audio}
                style={{
                  width: "100%",
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
              />

              <p
                style={{
                  color: "#2563EB",
                }}
              >
                Click to open Voice Note →
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;