import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import MemoryProvider from "./context/MemoryContext";
import ThemeProvider from "./context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <MemoryProvider>
        <App />
      </MemoryProvider>
    </ThemeProvider>
  </React.StrictMode>
);