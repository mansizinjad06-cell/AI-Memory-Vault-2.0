import {
  useContext,
  useState,
  useEffect,
} from "react";

import { useSearchParams } from "react-router-dom";

import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/memories";

function Documents() {
  const {
    documents,
    setDocuments,
  } = useContext(MemoryContext);

  const [editId, setEditId] =
    useState(null);

  const [documentName, setDocumentName] =
    useState("");

  const [selectedId, setSelectedId] =
    useState(null);

  const [loadingDocument, setLoadingDocument] =
    useState(false);

  const [searchParams] =
    useSearchParams();

  // =========================
  // SELECT DOCUMENT FROM SEARCH
  // =========================

  useEffect(() => {
    const documentId =
      searchParams.get("documentId");

    if (documentId) {
      setSelectedId(documentId);
    }
  }, [searchParams]);

  // =========================
  // UPLOAD DOCUMENT
  // =========================

  const handleDocument = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 10 MB validation
    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert(
        "File size is too large. Please upload a file smaller than 10 MB."
      );

      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const newDocument = {
        type: "document",

        title: file.name,

        fileName: file.name,

        fileData: reader.result,
      };

      try {
        const response = await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              newDocument
            ),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to save document"
          );
        }

        const savedDocument =
          await response.json();

        const documentForFrontend = {
          id: savedDocument._id,

          name:
            savedDocument.fileName ||
            savedDocument.title ||
            file.name,

          title:
            savedDocument.title ||
            savedDocument.fileName ||
            file.name,

          type:
            savedDocument.fileType ||
            savedDocument.mimeType ||
            file.type,

          data:
            savedDocument.fileData || "",
        };

        setDocuments(
          (prevDocuments) => [
            ...prevDocuments,
            documentForFrontend,
          ]
        );

        alert(
          "Document uploaded successfully! 📄"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Document could not be saved."
        );
      }
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // =========================
  // RENAME DOCUMENT
  // =========================

  const renameDocument = (doc) => {
    setEditId(doc.id);

    setDocumentName(
      doc.name ||
        doc.title ||
        "Untitled Document"
    );
  };

  // =========================
  // SAVE DOCUMENT NAME
  // =========================

  const saveDocument = async () => {
    if (documentName.trim() === "") {
      alert(
        "Please enter document name"
      );

      return;
    }

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
            title:
              documentName.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to rename document"
        );
      }

      setDocuments(
        (prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === editId
              ? {
                  ...doc,

                  name:
                    documentName.trim(),

                  title:
                    documentName.trim(),
                }
              : doc
          )
      );

      setEditId(null);

      setDocumentName("");
    } catch (error) {
      console.error(error);

      alert(
        "Document name could not be updated."
      );
    }
  };

  // =========================
  // DELETE DOCUMENT
  // =========================

  const deleteDocument = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete document"
        );
      }

      setDocuments(
        (prevDocuments) =>
          prevDocuments.filter(
            (doc) => doc.id !== id
          )
      );

      if (editId === id) {
        setEditId(null);

        setDocumentName("");
      }

      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Document could not be deleted."
      );
    }
  };

  // =========================
  // OPEN DOCUMENT
  // =========================

  const openDocument = async (doc) => {
    try {
      setLoadingDocument(true);

      let documentData = doc.data;

      // --------------------------------
      // If file data is not already loaded,
      // load ONLY this document.
      // --------------------------------

      if (!documentData) {
        const response = await fetch(
          `${API_URL}/${doc.id}/file`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load document"
          );
        }

        const data =
          await response.json();

        documentData = data.fileData;

        if (!documentData) {
          throw new Error(
            "Document file data is empty"
          );
        }

        // Save loaded data only for this
        // document in React state.
        setDocuments(
          (prevDocuments) =>
            prevDocuments.map(
              (item) =>
                item.id === doc.id
                  ? {
                      ...item,
                      data: documentData,
                    }
                  : item
            )
        );
      }

      // --------------------------------
      // Convert Base64 → Blob
      // --------------------------------

      const parts =
        documentData.split(",");

      if (parts.length < 2) {
        throw new Error(
          "Invalid document data"
        );
      }

      const mimeMatch =
        parts[0].match(
          /data:(.*?);base64/
        );

      const mimeType =
        mimeMatch?.[1] ||
        "application/octet-stream";

      const byteCharacters =
        atob(parts[1]);

      const byteNumbers =
        new Array(
          byteCharacters.length
        );

      for (
        let i = 0;
        i < byteCharacters.length;
        i++
      ) {
        byteNumbers[i] =
          byteCharacters.charCodeAt(i);
      }

      const byteArray =
        new Uint8Array(
          byteNumbers
        );

      const blob = new Blob(
        [byteArray],
        {
          type: mimeType,
        }
      );

      // --------------------------------
      // Create temporary browser URL
      // --------------------------------

      const blobUrl =
        URL.createObjectURL(blob);

      // --------------------------------
      // Open document
      // --------------------------------

      const newWindow =
        window.open(
          blobUrl,
          "_blank"
        );

      if (!newWindow) {
        alert(
          "Please allow pop-ups to open the document."
        );

        URL.revokeObjectURL(
          blobUrl
        );

        return;
      }

      // Give browser enough time to load
      // before removing temporary URL.
      setTimeout(() => {
        URL.revokeObjectURL(
          blobUrl
        );
      }, 60000);

    } catch (error) {
      console.error(
        "Document opening error:",
        error
      );

      alert(
        "Document could not be opened."
      );
    } finally {
      setLoadingDocument(false);
    }
  };

  // =========================
  // UI
  // =========================

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
        <h1>📄 Documents</h1>

        {/* =========================
            UPLOAD
        ========================= */}

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleDocument}
        />

        <p
          style={{
            color: "gray",
            fontSize: "14px",
          }}
        >
          Maximum file size: 10 MB
        </p>

        <br />

        {/* =========================
            RENAME
        ========================= */}

        {editId !== null && (
          <>
            <input
              type="text"
              value={documentName}
              onChange={(e) =>
                setDocumentName(
                  e.target.value
                )
              }
              placeholder="Enter new document name"
              style={{
                padding: "10px",
                width: "250px",
                marginRight: "10px",
              }}
            />

            <button
              onClick={saveDocument}
            >
              💾 Save
            </button>

            <button
              onClick={() => {
                setEditId(null);

                setDocumentName("");
              }}
              style={{
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>

            <br />
            <br />
          </>
        )}

        {/* =========================
            DOCUMENT LIST
        ========================= */}

        {documents.length === 0 ? (
          <p>
            No documents uploaded.
          </p>
        ) : (
          documents.map(
            (doc, index) => {
              const name =
                doc.name ||
                doc.title ||
                "Untitled Document";

              const isSelected =
                selectedId?.toString() ===
                doc.id?.toString();

              return (
                <div
                  key={
                    doc.id || index
                  }
                  style={{
                    border: isSelected
                      ? "3px solid #2563EB"
                      : "1px solid #ddd",

                    borderRadius: "10px",

                    padding: "15px",

                    marginBottom: "10px",

                    background:
                      isSelected
                        ? "#EFF6FF"
                        : "white",
                  }}
                >
                  {/* DOCUMENT NAME */}

                  <h3
                    style={{
                      margin: "0",
                    }}
                  >
                    📄 {name}
                  </h3>

                  {/* SELECTED MESSAGE */}

                  {isSelected && (
                    <p
                      style={{
                        color: "#2563EB",
                        fontWeight:
                          "bold",
                      }}
                    >
                      📌 Selected Document
                    </p>
                  )}

                  {/* BUTTONS */}

                  <div
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    <button
                      onClick={() =>
                        openDocument(
                          doc
                        )
                      }
                      disabled={
                        loadingDocument
                      }
                      style={{
                        marginRight:
                          "10px",
                      }}
                    >
                      {loadingDocument
                        ? "⏳ Opening..."
                        : "📂 Open"}
                    </button>

                    <button
                      onClick={() =>
                        renameDocument(
                          doc
                        )
                      }
                      style={{
                        marginRight:
                          "10px",
                      }}
                    >
                      ✏️ Rename
                    </button>

                    <button
                      onClick={() =>
                        deleteDocument(
                          doc.id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}

export default Documents;