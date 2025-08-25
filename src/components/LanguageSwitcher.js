import React from "react";
import "./LanguageSwitcher.css";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === "de" ? "active" : ""} lang-de`}
        onClick={() => setLanguage("de")}
        title="Deutsch"
      />
      <button
        className={`lang-btn ${language === "en" ? "active" : ""} lang-en`}
        onClick={() => setLanguage("en")}
        title="English"
      />
      <button
        className={`lang-btn ${language === "es" ? "active" : ""} lang-es`}
        onClick={() => setLanguage("es")}
        title="Español"
      />
    </div>
  );
}
