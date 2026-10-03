import { createContext, useState, useEffect } from "react";

export const MemoryContext = createContext();

const API_URL = "http://localhost:5000/api/memories";

function MemoryProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  // =========================
  // LOAD MEMORIES FROM MONGODB
  // =========================

  const loadMemories = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch memories");
      }

      const data = await response.json();

      // =========================
      // PHOTOS
      // =========================

      const backendPhotos = data
        .filter((memory) => memory.type === "photo")
        .map((memory) => ({
          id: memory._id,

          // File data is intentionally NOT loaded here.
          // It will be loaded only when required.
          image: null,

          name:
            memory.fileName ||
            memory.title ||
            "Untitled Photo",

          caption:
            memory.title ||
            memory.fileName ||
            "Untitled Photo",

          date: memory.createdAt,

          favorite: memory.favorite || false,
        }));

      // =========================
      // NOTES
      // =========================

      const backendNotes = data
        .filter((memory) => memory.type === "note")
        .map((memory) => ({
          id: memory._id,

          content:
            memory.content ||
            memory.title ||
            "",

          title:
            memory.title ||
            memory.content ||
            "",

          createdAt: memory.createdAt,
        }));

      // =========================
      // DOCUMENTS
      // =========================

      const backendDocuments = data
        .filter(
          (memory) =>
            memory.type === "document"
        )
        .map((memory) => ({
          id: memory._id,

          name:
            memory.fileName ||
            memory.title ||
            "Untitled Document",

          title:
            memory.title ||
            memory.fileName ||
            "Untitled Document",

          type:
            memory.fileType ||
            memory.mimeType ||
            "",

          // File data is intentionally NOT loaded here.
          data: null,

          createdAt: memory.createdAt,
        }));

      // =========================
      // VOICE NOTES
      // =========================

      const backendVoiceNotes = data
        .filter(
          (memory) =>
            memory.type === "voice"
        )
        .map((memory) => ({
          id: memory._id,

          title:
            memory.title ||
            "Untitled Voice Note",

          // Audio data is intentionally NOT loaded here.
          audio: null,

          createdAt: memory.createdAt,
        }));

      // =========================
      // SET DATA
      // =========================

      setPhotos(backendPhotos);
      setNotes(backendNotes);
      setDocuments(backendDocuments);
      setVoiceNotes(backendVoiceNotes);

      setBackendError(false);
    } catch (error) {
      console.log(
        "Backend connection error:",
        error.message
      );

      setBackendError(true);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA WHEN APP STARTS
  // =========================

  useEffect(() => {
    loadMemories();
  }, []);

  // =========================
  // PROVIDER
  // =========================

  return (
    <MemoryContext.Provider
      value={{
        photos,
        setPhotos,

        notes,
        setNotes,

        documents,
        setDocuments,

        voiceNotes,
        setVoiceNotes,

        loading,
        backendError,

        refreshMemories: loadMemories,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export default MemoryProvider;