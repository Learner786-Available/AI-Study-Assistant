import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { StudyProvider } from "./context/StudyContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <ThemeProvider>

      <AuthProvider>

        <StudyProvider>

          <App />

        </StudyProvider>

      </AuthProvider>

    </ThemeProvider>

  </React.StrictMode>
);