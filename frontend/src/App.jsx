import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Photo from "./pages/Photo";
import Notes from "./pages/Notes";
import Documents from "./pages/Documents";
import VoiceNotes from "./pages/VoiceNotes";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/photos" element={<Photo />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/voice" element={<VoiceNotes />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  );
}

export default App;