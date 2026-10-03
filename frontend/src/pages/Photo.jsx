import {
  useContext,
  useState,
  useEffect,
} from "react";

import { useSearchParams } from "react-router-dom";

import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/memories";

function Photo() {
  const { photos, setPhotos } =
    useContext(MemoryContext);

  const [searchParams] = useSearchParams();

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [caption, setCaption] = useState("");

  const [editId, setEditId] = useState(null);
  const [editCaption, setEditCaption] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [loadingImage, setLoadingImage] =
    useState(false);

  // ================================
  // LOAD ONE PHOTO FROM DATABASE
  // ================================

  const loadPhotoData = async (photo) => {
    if (!photo?.id) return;

    // Already loaded
    if (photo.image) {
      setSelectedImage(photo.image);
      return;
    }

    try {
      setLoadingImage(true);

      const response = await fetch(
        `${API_URL}/${photo.id}/file`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load photo"
        );
      }

      const data = await response.json();

      const imageData = data.fileData;

      if (!imageData) {
        throw new Error(
          "Photo data is empty"
        );
      }

      // Store the loaded image only for this
      // photo while the page is open.
      setPhotos((prevPhotos) =>
        prevPhotos.map((item) =>
          item.id === photo.id
            ? {
                ...item,
                image: imageData,
              }
            : item
        )
      );

      setSelectedImage(imageData);
    } catch (error) {
      console.error(error);

      alert(
        "Photo could not be loaded."
      );
    } finally {
      setLoadingImage(false);
    }
  };

  // ================================
  // OPEN SPECIFIC PHOTO FROM SEARCH
  // ================================

  useEffect(() => {
    const photoId =
      searchParams.get("photoId");

    if (!photoId) return;

    const photo = photos.find(
      (item) =>
        item.id?.toString() ===
        photoId.toString()
    );

    if (photo) {
      loadPhotoData(photo);
    }
  }, [photos, searchParams]);

  // ================================
  // ADD PHOTO
  // ================================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const photoName = file.name;

      const newPhoto = {
        type: "photo",

        title:
          caption.trim() || photoName,

        fileName: photoName,

        fileData: reader.result,

        favorite: false,
      };

      try {
        setSaving(true);

        const response = await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(newPhoto),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to save photo"
          );
        }

        const savedPhoto =
          await response.json();

        const photoForFrontend = {
          id: savedPhoto._id,

          image:
            savedPhoto.fileData ||
            reader.result,

          name:
            savedPhoto.fileName ||
            savedPhoto.title,

          caption:
            savedPhoto.title ||
            savedPhoto.fileName,

          date: savedPhoto.createdAt,

          favorite:
            savedPhoto.favorite || false,
        };

        setPhotos((prevPhotos) => [
          photoForFrontend,
          ...prevPhotos,
        ]);

        setCaption("");

        alert(
          "Photo saved successfully! 📷"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Photo could not be saved to database."
        );
      } finally {
        setSaving(false);
      }
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // ================================
  // DELETE PHOTO
  // ================================

  const deletePhoto = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete photo"
        );
      }

      setPhotos((prevPhotos) =>
        prevPhotos.filter(
          (photo) => photo.id !== id
        )
      );

      if (selectedImage) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Photo could not be deleted."
      );
    }
  };

  // ================================
  // FAVORITE
  // ================================

  const toggleFavorite = async (photo) => {
    const newFavorite =
      !photo.favorite;

    try {
      const response = await fetch(
        `${API_URL}/${photo.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            favorite: newFavorite,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update favorite"
        );
      }

      setPhotos((prevPhotos) =>
        prevPhotos.map((item) =>
          item.id === photo.id
            ? {
                ...item,
                favorite:
                  newFavorite,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Favorite could not be updated."
      );
    }
  };

  // ================================
  // START EDIT
  // ================================

  const startEdit = (photo) => {
    setEditId(photo.id);

    setEditCaption(
      photo.caption ||
        photo.name ||
        "Untitled Photo"
    );
  };

  // ================================
  // SAVE EDIT
  // ================================

  const saveEdit = async (id) => {
    if (editCaption.trim() === "") {
      alert("Please enter photo name");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              editCaption.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update photo name"
        );
      }

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === id
            ? {
                ...photo,
                caption:
                  editCaption.trim(),
              }
            : photo
        )
      );

      setEditId(null);
      setEditCaption("");
    } catch (error) {
      console.error(error);

      alert(
        "Photo name could not be updated."
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h1>📷 Photos</h1>

        <br />

        {/* PHOTO NAME */}

        <input
          type="text"
          placeholder="Enter photo name..."
          value={caption}
          onChange={(e) =>
            setCaption(e.target.value)
          }
          style={{
            padding: "10px",
            width: "280px",
            marginBottom: "15px",
          }}
        />

        <br />

        {/* FILE UPLOAD */}

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          disabled={saving}
        />

        {saving && (
          <p style={{ color: "#2563eb" }}>
            Saving photo... ⏳
          </p>
        )}

        <br />
        <br />

        {/* PHOTOS */}

        {photos.length === 0 ? (
          <p>No Photos Uploaded.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px,1fr))",
              gap: "20px",
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow:
                    "0 0 8px lightgray",
                  background: "#fff",
                }}
              >
                {/* IMAGE */}

                {photo.image ? (
                  <img
                    src={photo.image}
                    alt={
                      photo.caption ||
                      photo.name ||
                      "Memory"
                    }
                    onClick={() =>
                      setSelectedImage(
                        photo.image
                      )
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <div
                    onClick={() =>
                      loadPhotoData(photo)
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "10px",
                      background:
                        "#f3f4f6",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      cursor: "pointer",
                      color: "#2563eb",
                      fontWeight: "bold",
                    }}
                  >
                    📷 Click to load photo
                  </div>
                )}

                {/* EDIT NAME */}

                {editId === photo.id ? (
                  <div
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) =>
                        setEditCaption(
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
                        saveEdit(
                          photo.id
                        )
                      }
                    >
                      💾 Save
                    </button>

                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditCaption("");
                      }}
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h3>
                      {photo.caption ||
                        photo.name ||
                        "Untitled Photo"}
                    </h3>

                    <button
                      onClick={() =>
                        startEdit(photo)
                      }
                    >
                      ✏️ Edit Name
                    </button>
                  </>
                )}

                {/* DATE */}

                <p
                  style={{
                    fontSize: "13px",
                    color: "gray",
                  }}
                >
                  {photo.date}
                </p>

                {/* FAVORITE */}

                <button
                  onClick={() =>
                    toggleFavorite(photo)
                  }
                  style={{
                    marginRight: "10px",
                  }}
                >
                  {photo.favorite
                    ? "⭐ Favorite"
                    : "🤍 Favorite"}
                </button>

                {/* DELETE */}

                <button
                  onClick={() =>
                    deletePhoto(
                      photo.id
                    )
                  }
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* IMAGE LOADING */}

        {loadingImage && (
          <p
            style={{
              color: "#2563eb",
              marginTop: "20px",
            }}
          >
            Loading photo... ⏳
          </p>
        )}

        {/* IMAGE PREVIEW */}

        {selectedImage && (
          <div
            onClick={() =>
              setSelectedImage(null)
            }
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              zIndex: 1000,
              cursor: "pointer",
            }}
          >
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "10px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Photo;