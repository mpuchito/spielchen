import React, { useState, useEffect } from "react";
import "./Wavelength.css";
import { useLanguage } from "../context/LanguageContext";

const getRandomIndex = (length, exclude) => {
  if (length <= 1) return 0;
  let index;
  do index = Math.floor(Math.random() * length);
  while (index === exclude);
  return index;
};

export default function Wavelength() {
  const { translations } = useLanguage();

  // pares según idioma actual
  const [pairs, setPairs] = useState(() => translations.wavelengthPairs || []);
  const [phase, setPhase] = useState("config");
  const [topWord, setTopWord] = useState("");
  const [bottomWord, setBottomWord] = useState("");
  const [correctPos, setCorrectPos] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [newTop, setNewTop] = useState("");
  const [newBottom, setNewBottom] = useState("");
  const [lastIndex, setLastIndex] = useState(null);
  const [positionStats, setPositionStats] = useState(Array(9).fill(0));

  // al cambiar idioma, refresca pares y estado
  useEffect(() => {
    setPairs(translations.wavelengthPairs || []);
    setPhase("config");
    setLastIndex(null);
    setSelectedPos(null);
  }, [translations]);

  const startGame = () => {
    if (!pairs.length) return;
    const index = getRandomIndex(pairs.length, lastIndex);
    const pair = pairs[index];
    setTopWord(pair.top);
    setBottomWord(pair.bottom);

    const weightedPositions = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8];
    const randomPos =
      weightedPositions[Math.floor(Math.random() * weightedPositions.length)];
    setCorrectPos(randomPos);

    setPositionStats((prev) => {
      const updated = [...prev];
      updated[randomPos]++;
      return updated;
    });

    setSelectedPos(null);
    setLastIndex(index);
    setPhase("show");
  };

  const addPair = () => {
    if (newTop.trim() && newBottom.trim()) {
      setPairs((p) => [...p, { top: newTop.trim(), bottom: newBottom.trim() }]);
      setNewTop("");
      setNewBottom("");
    }
  };

  const resetPairs = () => {
    setPairs(translations.wavelengthPairs || []);
    setLastIndex(null);
    setPositionStats(Array(9).fill(0));
  };

  const handleGuess = (index) => {
    setSelectedPos(index);
    setPhase("result");
  };

  const nextRound = () => startGame();

  if (phase === "config") {
    return (
      <div className="config-screen">
        <h2>{translations.wavelength_config}</h2>
        <input
          placeholder={translations.topWordPlaceholder}
          value={newTop}
          onChange={(e) => setNewTop(e.target.value)}
        />
        <input
          placeholder={translations.bottomWordPlaceholder}
          value={newBottom}
          onChange={(e) => setNewBottom(e.target.value)}
        />
        <button onClick={addPair}>{translations.addPair}</button>
        <button onClick={resetPairs}>{translations.clearPairs}</button>
        <button
          className="btn-primary"
          disabled={pairs.length === 0}
          onClick={startGame}
        >
          {translations.startGame}
        </button>
      </div>
    );
  }

  return (
    <div className="wavelength-game">
      <h2>{topWord}</h2>
      <div className="scale">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`zone ${selectedPos === i ? "selected" : ""}`}
            onClick={() => phase === "guess" && handleGuess(i)}
          >
            {phase !== "config" && i === correctPos && (
              <div className="marker black" />
            )}
            {phase === "result" && i === selectedPos && (
              <div className="marker red" />
            )}
          </div>
        ))}
      </div>
      <h2>{bottomWord}</h2>

      {phase === "show" && (
        <button onClick={() => setPhase("guess")}>{translations.continue}</button>
      )}

      {phase === "result" && (
        <>
          <button className="btn-primary" onClick={nextRound}>
            {translations.newRound}
          </button>
          <button onClick={() => (window.location.href = "/")}>
            {translations.home}
          </button>
        </>
      )}
    </div>
  );
}
