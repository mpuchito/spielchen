import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Wordle.css";

const MAX_TRIES = 6;
const COLS = 5;

function evaluateGuess(guess, answer) {
  const a = answer.split("");
  const g = guess.split("");
  const res = Array(COLS).fill("absent");
  const freq = {};
  for (let i = 0; i < COLS; i++) freq[a[i]] = (freq[a[i]] || 0) + 1;
  for (let i = 0; i < COLS; i++) if (g[i] === a[i]) { res[i] = "correct"; freq[g[i]]--; }
  for (let i = 0; i < COLS; i++)
    if (res[i] !== "correct" && freq[g[i]] > 0) { res[i] = "present"; freq[g[i]]--; }
  return res;
}

function Cell({ letter, state }) {
  return <div className={`wordle-cell ${state || ""}`}>{letter || ""}</div>;
}

export function WordleGame({ answer }) {
  const { translations } = useLanguage();
  const t = translations.wordle || { probar: "Probar", correcto: "Correcto", error: "Sin intentos", de: "Era", placeholder: "ABCDE" };

  const [rows, setRows] = useState([]);     // [{guess, eval:[...]}]
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("playing");
  const inputRef = useRef(null);

  // Reinicia tablero cuando cambia la palabra
  useEffect(() => {
    setRows([]);
    setCurrent("");
    setStatus("playing");
    inputRef.current?.focus();
  }, [answer?.id, answer?.word]);

  const onEnter = () => {
    if (status !== "playing") return;
    const guess = current.trim().toLowerCase();
    if (guess.length !== COLS) return;

    const evalRes = evaluateGuess(guess, answer.word);
    const next = [...rows, { guess, eval: evalRes }];
    setRows(next);
    setCurrent("");

    if (guess === answer.word) setStatus("won");
    else if (next.length >= MAX_TRIES) setStatus("lost");
  };

  return (
    <div className="wordle">
      {/* REJILLA DE 6 INTENTOS */}
      <div className="wordle-grid">
        {Array.from({ length: MAX_TRIES }).map((_, r) => (
          <div key={r} className="wordle-row">
            {Array.from({ length: COLS }).map((_, c) => {
              const letter = rows[r]?.guess?.[c] || (r === rows.length ? (current[c] || "") : "");
              const state  = rows[r]?.eval?.[c] || null;
              return <Cell key={c} letter={letter} state={state} />;
            })}
          </div>
        ))}
      </div>

      {status === "playing" && (
        <div className="wordle-actions">
          <input
            ref={inputRef}
            className="wordle-input"
            maxLength={COLS}
            value={current.toUpperCase()}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder={t.placeholder || "ABCDE"}
          />
          <button className="btn-primary" onClick={onEnter}>{t.probar}</button>
        </div>
      )}

      {status === "won"  && <div className="wordle-msg ok">{t.correcto}. {t.de} <b>{answer.word.toUpperCase()}</b>.</div>}
      {status === "lost" && <div className="wordle-msg error">{t.error}. {t.de} <b>{answer.word.toUpperCase()}</b>.</div>}
    </div>
  );
}
