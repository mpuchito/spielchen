import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";  // importa el provider
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>   {/* App queda dentro del contexto */}
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
