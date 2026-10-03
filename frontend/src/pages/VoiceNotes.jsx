import {
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";

import { useSearchParams } from "react-router-dom";

import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/memories";

function VoiceNotes() {
  const { voiceNotes, setVoiceNotes } =
    useContext(MemoryContext);

  const [recording, setRecording] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [selectedId, setSelectedId] =
    useState(null);

  const [loadingAudio, setLoadingAudio] =
    useState(false);

  const [searchParams] =
    useSearchParams();

  const mediaRecorderRef =
    useRef(null);

  const chunksRef = useRef([]);

  // =========================
  // OPEN FROM SEARCH
  // =========================

  useEffect(() => {
    const voiceId =
      searchParams.get("voiceId");

    if (voiceId) {
      setSelectedId(voiceId);
    }
  }, [searchParams]);

  // =========================
  // LOAD ONE AUDIO FILE
  // =========================

  const loadAudioData = async (note) => {
    if (!note?.id) return;

    // Already loaded
    if (note.audio) {
      return note.audio;
    }

    try {
      setLoadingAudio(true);

      const response = await fetch(
        `${API_URL}/${note.id}/file`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load voice note"
        );
      }

      const data =
        await response.json();

      const audioData =
        data.fileData;

      if (!audioData) {
        throw new Error(
          "Audio data is empty"
        );
      }

      setVoiceNotes((prevNotes) =>
        prevNotes.map((item) =>
          item.id === note.id
            ? {
                ...item,
                audio: audioData,
              }
            : item
        )
      );

      return audioData;
    } catch (error) {
      console.error(error);

      alert(
        "Voice note could not be loaded."
      );

      return null;
    } finally {
      setLoadingAudio(false);
    }
  };

  // =========================
  // START RECORDING
  // =========================

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable =
        (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(
              event.data
            );
          }
        };

      mediaRecorder.onstop = () => {
        const blob = new Blob(
          chunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const reader =
          new FileReader();

        reader.onloadend = async () => {
          const newVoiceNote = {
            type: "voice",

            title: `Recording ${
              voiceNotes.length + 1
            }`,

            fileName: `Recording ${
              voiceNotes.length + 1
            }`,

            fileData: reader.result,
          };

          try {
            const response =
              await fetch(API_URL, {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  newVoiceNote
                ),
              });

            if (!response.ok) {
              throw new Error(
                "Failed to save voice note"
              );
            }

            const savedVoice =
              await response.json();

            const voiceForFrontend = {
              id: savedVoice._id,

              title:
                savedVoice.title ||
                savedVoice.fileName,

              audio:
                savedVoice.fileData ||
                reader.result,

              createdAt:
                savedVoice.createdAt,
            };

            setVoiceNotes((prevNotes) => [
              ...prevNotes,
              voiceForFrontend,
            ]);

            alert(
              "Voice note saved successfully! 🎤"
            );
          } catch (error) {
            console.error(error);

            alert(
              "Voice note could not be saved."
            );
          }
        };

        reader.readAsDataURL(blob);

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      };

      mediaRecorder.start();

      setRecording(true);
    } catch (error) {
      console.error(error);

      alert(
        "Microphone permission denied."
      );
    }
  };

  // =========================
  // STOP RECORDING
  // =========================

  const stopRecording = () => {
    if (
      mediaRecorderRef.current
    ) {
      mediaRecorderRef.current.stop();

      setRecording(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteRecording = async (id) => {
    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to delete voice note"
        );
      }

      setVoiceNotes((prevNotes) =>
        prevNotes.filter(
          (note) => note.id !== id
        )
      );

      if (editId === id) {
        setEditId(null);
        setEditTitle("");
      }

      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Voice note could not be deleted."
      );
    }
  };

  // =========================
  // EDIT NAME
  // =========================

  const startEdit = (note) => {
    setEditId(note.id);

    setEditTitle(
      note.title || "Voice Note"
    );
  };

  // =========================
  // SAVE EDIT
  // =========================

  const saveEdit = async (id) => {
    if (
      editTitle.trim() === ""
    ) {
      alert(
        "Please enter voice note name"
      );

      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                editTitle.trim(),
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to rename voice note"
        );
      }

      setVoiceNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id
            ? {
                ...note,
                title:
                  editTitle.trim(),
              }
            : note
        )
      );

      setEditId(null);
      setEditTitle("");
    } catch (error) {
      console.error(error);

      alert(
        "Voice note name could not be updated."
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "1000px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1>🎤 Voice Notes</h1>

        <br />

        {!recording ? (
          <button
            onClick={startRecording}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            ⏹️ Stop Recording
          </button>
        )}

        <br />
        <br />

        {voiceNotes.length === 0 ? (
          <p
            style={{
              color: "gray",
              fontSize: "18px",
            }}
          >
            🎤 No voice recordings
            available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {voiceNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.1)",
                  border:
                    selectedId?.toString() ===
                    note.id?.toString()
                      ? "3px solid #2563EB"
                      : "1px solid #eee",
                }}
              >
                {selectedId?.toString() ===
                  note.id?.toString() && (
                  <p
                    style={{
                      color: "#2563EB",
                      fontWeight: "bold",
                    }}
                  >
                    📌 Selected Voice Memory
                  </p>
                )}

                {editId === note.id ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        width: "90%",
                      }}
                    />

                    <br />
                    <br />

                    <button
                      onClick={() =>
                        saveEdit(note.id)
                      }
                    >
                      💾 Save
                    </button>

                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditTitle("");
                      }}
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3>
                      {note.title ||
                        "Voice Note"}
                    </h3>

                    <button
                      onClick={() =>
                        startEdit(note)
                      }
                    >
                      ✏️ Edit Name
                    </button>
                  </>
                )}

                <p
                  style={{
                    color: "gray",
                    fontSize: "14px",
                  }}
                >
                  {note.createdAt}
                </p>

                <br />

                {note.audio ? (
                  <audio
                    controls
                    src={note.audio}
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  <button
                    onClick={() =>
                      loadAudioData(note)
                    }
                    disabled={loadingAudio}
                    style={{
                      padding: "10px 15px",
                    }}
                  >
                    {loadingAudio
                      ? "⏳ Loading audio..."
                      : "▶️ Load & Play Audio"}
                  </button>
                )}

                <br />
                <br />

                <button
                  onClick={() =>
                    deleteRecording(
                      note.id
                    )
                  }
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceNotes;