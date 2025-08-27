import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";   // 👈 nuevo provider
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <UserProvider>     {/* 👈 App queda dentro de ambos contextos */}
        <App />
      </UserProvider>
    </LanguageProvider>
  </React.StrictMode>
);
