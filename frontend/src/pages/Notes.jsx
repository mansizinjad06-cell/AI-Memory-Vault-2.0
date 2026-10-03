import {
  useContext,
  useState,
  useEffect,
} from "react";

import { useSearchParams } from "react-router-dom";

import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/memories";

function Notes() {
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState(null);

  const [selectedId, setSelectedId] =
    useState(null);

  const [searchParams] =
    useSearchParams();

  const { notes, setNotes } =
    useContext(MemoryContext);

  // Open note from Search
  useEffect(() => {
    const noteId =
      searchParams.get("noteId");

    if (noteId !== null) {
      setSelectedId(noteId);
    }
  }, [searchParams]);

  // =========================
  // ADD / UPDATE NOTE
  // =========================

  const addNote = async () => {
    if (note.trim() === "") {
      alert("Please enter a note");
      return;
    }

    // UPDATE EXISTING NOTE
    if (editId !== null) {
      try {
        const response = await fetch(
          `${API_URL}/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              content: note.trim(),
              title: note.trim(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to update note"
          );
        }

        const updatedMemory =
          await response.json();

        setNotes(
          notes.map((item) =>
            item.id === editId
              ? {
                  id: updatedMemory._id,
                  content:
                    updatedMemory.content,
                  title:
                    updatedMemory.title,
                }
              : item
          )
        );

        setEditId(null);
        setNote("");

      } catch (error) {
        console.error(error);
        alert(
          "Note could not be updated."
        );
      }

      return;
    }

    // ADD NEW NOTE
    try {
      const newMemory = {
        type: "note",
        title: note.trim(),
        content: note.trim(),
      };

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(newMemory),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save note"
        );
      }

      const savedMemory =
        await response.json();

      const noteForFrontend = {
        id: savedMemory._id,
        content: savedMemory.content,
        title: savedMemory.title,
      };

      setNotes([
        ...notes,
        noteForFrontend,
      ]);

      setNote("");

    } catch (error) {
      console.error(error);
      alert(
        "Note could not be saved."
      );
    }
  };

  // =========================
  // EDIT NOTE
  // =========================

  const editNote = (item) => {
    setNote(
      item.content ||
        item.title ||
        ""
    );

    setEditId(item.id);
  };

  // =========================
  // DELETE NOTE
  // =========================

  const deleteNote = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete note"
        );
      }

      setNotes(
        notes.filter(
          (item) => item.id !== id
        )
      );

      if (editId === id) {
        setEditId(null);
        setNote("");
      }

      if (selectedId === id) {
        setSelectedId(null);
      }

    } catch (error) {
      console.error(error);

      alert(
        "Note could not be deleted."
      );
    }
  };

  // =========================
  // EXPORT NOTES
  // =========================

  const exportNotes = () => {
    if (notes.length === 0) {
      alert(
        "No notes available to export."
      );
      return;
    }

    const text = notes
      .map(
        (item) =>
          item.content ||
          item.title ||
          ""
      )
      .join(
        "\n\n----------------------\n\n"
      );

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "MyNotes.txt";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
        }}
      >
        <h1>📝 Notes</h1>

        <input
          type="text"
          placeholder="Write a note..."
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          style={{
            padding: "10px",
            width: "300px",
          }}
        />

        <button
          onClick={addNote}
          style={{
            marginLeft: "10px",
            padding: "10px",
          }}
        >
          {editId !== null
            ? "Update Note"
            : "Add Note"}
        </button>

        <button
          onClick={exportNotes}
          style={{
            marginLeft: "10px",
            padding: "10px",
          }}
        >
          Export Notes
        </button>

        <br />
        <br />

        {notes.length === 0 ? (
          <p>No Notes Available.</p>
        ) : (
          notes.map((item) => {
            const itemId =
              item.id;

            const itemText =
              item.content ||
              item.title ||
              item;

            return (
              <div
                key={itemId}
                style={{
                  border:
                    selectedId === itemId
                      ? "3px solid #2563EB"
                      : "1px solid lightgray",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  background:
                    selectedId === itemId
                      ? "#EFF6FF"
                      : "white",
                }}
              >
                <p>{itemText}</p>

                {selectedId ===
                  itemId && (
                  <p
                    style={{
                      color: "#2563EB",
                      fontWeight: "bold",
                    }}
                  >
                    📌 Selected Memory
                  </p>
                )}

                <button
                  onClick={() =>
                    editNote(item)
                  }
                  style={{
                    marginRight: "10px",
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    deleteNote(itemId)
                  }
                >
                  🗑️ Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Notes;