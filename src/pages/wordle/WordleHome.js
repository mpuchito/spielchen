import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";


export default function WordleHome() {
const nav = useNavigate();
const { language, setLang, translations } = useLanguage();
const t = translations.wordle || {
resolver: "Resolver palabra",
crear: "Crear palabra",
idioma: "Idioma",
};


return (
<div className="p-4 max-w-xl mx-auto">
<h1 className="wordle-title">{t.title}</h1>

<button className="wordle-btn primary"
  onClick={() => nav("/wordle/resolver")}>
  {t.resolver}</button>

<button className="wordle-btn secondary"
  onClick={() => nav("/wordle/crear")}>
  {t.crear}
</button>
</div>
);
}