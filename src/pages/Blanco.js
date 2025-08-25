import React, { useState } from "react";
import "./Blanco.css";
import { useLanguage } from "../context/LanguageContext";

export default function Blanco() {
  const { translations } = useLanguage();

  const [showPopup, setShowPopup] = useState(false);
  const [stage, setStage] = useState("setup");
  const [word, setWord] = useState("");
  const [players, setPlayers] = useState(3);
  const [current, setCurrent] = useState(1);
  const [blankIndex, setBlankIndex] = useState(null);
  const [showWord, setShowWord] = useState(false);

  const startGame = () => {
    if (!word.trim()) {
      alert(translations.enterWordAlert);
      return;
    }
    const randomBlank = Math.floor(Math.random() * players) + 1;
    setBlankIndex(randomBlank);
    setStage("player");
  };

  const nextPlayer = () => {
    setShowWord(false);
    if (current < players) setCurrent(current + 1);
    else setStage("end");
  };

  const resetGame = () => {
    setStage("setup");
    setCurrent(1);
    setWord("");
    setBlankIndex(null);
    setShowWord(false);
  };

  return (
    <div className="blanco-wrap">
      {stage === "setup" && (
        <div className="card blanco-card">
          <h2 className="title">🎲 {translations.configureGame}</h2>

          <label className="label">{translations.numberOfPlayers}</label>
          <div className="counter">
            <button
              className="round-btn"
              onClick={() => setPlayers((p) => Math.max(2, p - 1))}
            >
              −
            </button>
            <div className="count">{players}</div>
            <button
              className="round-btn"
              onClick={() => setPlayers((p) => Math.min(12, p + 1))}
            >
              +
            </button>
          </div>

          <label className="label" htmlFor="secret">
            {translations.enterWord}
          </label>
          <input
            id="secret"
            className="input"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />

          <button className="btn-primary start" onClick={startGame}>
            {translations.play}
          </button>
        </div>
      )}

      {stage === "player" && (
        <div className="card blanco-card">
          <h2 className="title">
            {translations.player} {current}
          </h2>

          {!showWord ? (
            <button className="btn ghost" onClick={() => setShowWord(true)}>
              👁 {translations.showWord}
            </button>
          ) : (
            <>
              <p className={current === blankIndex ? "blank" : "word"}>
                {current === blankIndex ? translations.blank : word}
              </p>
              <button className="btn-primary next" onClick={nextPlayer}>
                {translations.nextPlayer} ➡️
              </button>
            </>
          )}
        </div>
      )}

      {stage === "end" && (
        <div className="card blanco-card">
          <h2 className="title">🎉 {translations.gameBegins}</h2>
          <div className="button-row">
            <button className="btn ghost" onClick={() => setShowPopup(true)}>
              🕵️ {translations.revealSecretWord}
            </button>
            <button className="btn-primary" onClick={resetGame}>
              🔄 {translations.newRound}
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">{translations.secretWordWas}</h3>
            <p className="revealed-word">{word}</p>
            <button className="btn" onClick={() => setShowPopup(false)}>
              {translations.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
