import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryContext } from "../context/MemoryContext";
import Navbar from "../components/Navbar";
import MemoryChart from "../components/MemoryChart";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const {
    photos,
    notes,
    documents,
    voiceNotes,
  } = useContext(MemoryContext);

  const totalMemories =
    photos.length +
    notes.length +
    documents.length +
    voiceNotes.length;

  const goalProgress = Math.min((totalMemories / 100) * 100, 100);

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        {/* HERO SECTION */}

        <section className="dashboard-hero">
          <div>
            <p className="hero-small-text">
              👋 Welcome back, Mansi
            </p>

            <h1>
              AI Memory Vault <span>2.0</span>
            </h1>

            <p className="hero-description">
              Your personal digital memory space to store,
              organize and preserve your important moments.
            </p>
          </div>

          <div className="hero-memory-icon">
            🧠
          </div>
        </section>


        {/* STATS */}

        <section className="stats-grid">

          <div
            className="stats-card photo-card"
            onClick={() => navigate("/photos")}
          >
            <div className="stats-icon">📷</div>
            <div>
              <p>Photos</p>
              <h2>{photos.length}</h2>
            </div>
          </div>

          <div
            className="stats-card notes-card"
            onClick={() => navigate("/notes")}
          >
            <div className="stats-icon">📝</div>
            <div>
              <p>Notes</p>
              <h2>{notes.length}</h2>
            </div>
          </div>

          <div
            className="stats-card documents-card"
            onClick={() => navigate("/documents")}
          >
            <div className="stats-icon">📄</div>
            <div>
              <p>Documents</p>
              <h2>{documents.length}</h2>
            </div>
          </div>

          <div
            className="stats-card voice-card"
            onClick={() => navigate("/voice")}
          >
            <div className="stats-icon">🎤</div>
            <div>
              <p>Voice Notes</p>
              <h2>{voiceNotes.length}</h2>
            </div>
          </div>

        </section>


        {/* TOTAL MEMORY */}

        <section className="total-memory-card">

          <div>
            <p className="section-label">
              📊 Memory Analytics
            </p>

            <h2>Total Memories</h2>

            <p className="analytics-description">
              Everything you have stored in your Memory Vault.
            </p>
          </div>

          <div className="total-memory-number">
            {totalMemories}
          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>⚡ Quick Actions</h2>
              <p>Save something new to your memory vault.</p>
            </div>
          </div>

          <div className="quick-actions-grid">

            <button
              className="quick-action photo-action"
              onClick={() => navigate("/photos")}
            >
              <span>📷</span>
              <div>
                <strong>Add Photo</strong>
                <small>Save a special moment</small>
              </div>
            </button>

            <button
              className="quick-action note-action"
              onClick={() => navigate("/notes")}
            >
              <span>📝</span>
              <div>
                <strong>Add Note</strong>
                <small>Write down your thoughts</small>
              </div>
            </button>

            <button
              className="quick-action document-action"
              onClick={() => navigate("/documents")}
            >
              <span>📄</span>
              <div>
                <strong>Upload Document</strong>
                <small>Keep important files safe</small>
              </div>
            </button>

            <button
              className="quick-action voice-action"
              onClick={() => navigate("/voice")}
            >
              <span>🎤</span>
              <div>
                <strong>Record Voice</strong>
                <small>Save a voice memory</small>
              </div>
            </button>

          </div>

        </section>


        {/* TWO COLUMN AREA */}

        <div className="dashboard-two-column">

          {/* RECENT ACTIVITY */}

          <section className="dashboard-card">

            <div className="card-heading">
              <div>
                <h2>🕒 Recent Activity</h2>
                <p>Your memory collection overview.</p>
              </div>
            </div>

            {totalMemories === 0 ? (
              <div className="empty-state">
                <div>📭</div>
                <p>No recent activity.</p>
                <small>
                  Start adding memories to see activity here.
                </small>
              </div>
            ) : (
              <div className="activity-list">

                {photos.length > 0 && (
                  <div className="activity-item">
                    <span>📷</span>
                    <div>
                      <strong>Photos</strong>
                      <p>{photos.length} photo(s) stored</p>
                    </div>
                  </div>
                )}

                {notes.length > 0 && (
                  <div className="activity-item">
                    <span>📝</span>
                    <div>
                      <strong>Notes</strong>
                      <p>{notes.length} note(s) stored</p>
                    </div>
                  </div>
                )}

                {documents.length > 0 && (
                  <div className="activity-item">
                    <span>📄</span>
                    <div>
                      <strong>Documents</strong>
                      <p>{documents.length} document(s) stored</p>
                    </div>
                  </div>
                )}

                {voiceNotes.length > 0 && (
                  <div className="activity-item">
                    <span>🎤</span>
                    <div>
                      <strong>Voice Notes</strong>
                      <p>{voiceNotes.length} recording(s) stored</p>
                    </div>
                  </div>
                )}

              </div>
            )}

          </section>


          {/* MEMORY GOAL */}

          <section className="dashboard-card goal-card">

            <div className="card-heading">
              <div>
                <h2>🎯 Memory Goal</h2>
                <p>Your goal is 100 memories.</p>
              </div>
            </div>

            <div className="goal-circle">
              <span>{Math.round(goalProgress)}%</span>
            </div>

            <h3>
              {totalMemories} / 100 Memories
            </h3>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>

            <p className="goal-message">
              {totalMemories >= 100
                ? "🎉 Goal completed!"
                : `Only ${100 - totalMemories} more memories to reach your goal.`}
            </p>

          </section>

        </div>


        {/* MEMORY CATEGORIES */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>📂 Memory Categories</h2>
              <p>Explore your memories by category.</p>
            </div>
          </div>

          <div className="categories-grid">

            <div
              className="category-card category-photo"
              onClick={() => navigate("/photos")}
            >
              <span>📷</span>
              <h3>Photos</h3>
              <strong>{photos.length}</strong>
              <small>Memories</small>
            </div>

            <div
              className="category-card category-note"
              onClick={() => navigate("/notes")}
            >
              <span>📝</span>
              <h3>Notes</h3>
              <strong>{notes.length}</strong>
              <small>Memories</small>
            </div>

            <div
              className="category-card category-document"
              onClick={() => navigate("/documents")}
            >
              <span>📄</span>
              <h3>Documents</h3>
              <strong>{documents.length}</strong>
              <small>Memories</small>
            </div>

            <div
              className="category-card category-voice"
              onClick={() => navigate("/voice")}
            >
              <span>🎤</span>
              <h3>Voice Notes</h3>
              <strong>{voiceNotes.length}</strong>
              <small>Memories</small>
            </div>

          </div>

        </section>


        {/* CHART */}

        <section className="dashboard-card chart-card">

          <div className="card-heading">
            <div>
              <h2>📈 Memory Statistics</h2>
              <p>Visual overview of your stored memories.</p>
            </div>
          </div>

          <MemoryChart
            photos={photos}
            notes={notes}
            documents={documents}
            voiceNotes={voiceNotes}
          />

        </section>


        {/* STORAGE */}

        <section className="dashboard-card storage-card">

          <div className="storage-header">

            <div>
              <h2>💾 Storage Usage</h2>
              <p>
                {totalMemories} memories stored in your vault.
              </p>
            </div>

            <strong>
              {Math.round(goalProgress)}%
            </strong>

          </div>

          <div className="storage-track">
            <div
              className="storage-fill"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>

          <small>
            Memory capacity: {totalMemories} / 100
          </small>

        </section>


        {/* MEMORY INSIGHTS */}

        <section className="insights-card">

          <div className="insights-icon">
            🧠
          </div>

          <div>
            <h2>Memory Insights</h2>

            <p>
              You currently have{" "}
              <strong>{totalMemories}</strong>{" "}
              memories safely stored in your AI Memory Vault.
            </p>

            <small>
              Keep preserving your important moments 🚀
            </small>
          </div>

        </section>


        {/* FEATURE CARDS */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>🚀 Explore Your Vault</h2>
              <p>Access all your memory management tools.</p>
            </div>
          </div>

          <div className="feature-grid">

            <div
              className="feature-card"
              onClick={() => navigate("/photos")}
            >
              <div className="feature-icon">📷</div>
              <h3>Photos</h3>
              <p>Store and manage your memorable photos.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => navigate("/voice")}
            >
              <div className="feature-icon">🎤</div>
              <h3>Voice Notes</h3>
              <p>Record and preserve your voice memories.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => navigate("/documents")}
            >
              <div className="feature-icon">📄</div>
              <h3>Documents</h3>
              <p>Keep your important documents organized.</p>
            </div>

            <div
              className="feature-card"
              onClick={() => navigate("/notes")}
            >
              <div className="feature-icon">📝</div>
              <h3>Notes</h3>
              <p>Write, edit and manage your personal notes.</p>
            </div>

            <div
              className="feature-card search-feature"
              onClick={() => navigate("/search")}
            >
              <div className="feature-icon">🔍</div>
              <h3>Search</h3>
              <p>Find your memories quickly and easily.</p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;