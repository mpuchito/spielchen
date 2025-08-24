import React, { useState, useEffect, useContext } from 'react';
import './Wavelength.css';
import { LanguageContext } from './LanguageContext';

const DEFAULT_PAIRS = [
  { top: "Logisch", bottom: "Unlogisch" },
  { top: "Liebe ich", bottom: "Hasse ich" },
  { top: "Großstadt", bottom: "Dorf" },
  { top: "Jederzeit", bottom: "Nie im Leben" },
  { top: "Bestes Jahr in der Geschichte", bottom: "Schlimmstes Jahr in der Geschichte" },
  { top: "Geht klar", bottom: "Geht gar nicht" },
  { top: "Traum", bottom: "Albtraum" },
  { top: "Nützlich in einer Apokalypse", bottom: "Nutzlos in einer Apokalypse" },
  { top: "Langweilig", bottom: "Spannend" },
  { top: "Ganz klar Betrug", bottom: "Auf keinen Fall Betrug" },
  { top: "Toxisch", bottom: "Gesund" },
  { top: "Red Flag", bottom: "Green Flag" },
  { top: "Guter Treffpunkt", bottom: "Schlechter Treffpunkt" },
  { top: "Bester Tag des Jahres", bottom: "Schlimmster Tag des Jahres" },
  { top: "Guter Urlaubsort", bottom: "Bleibe lieber zuhause" },
  { top: "Boomer", bottom: "Millennial" },
  { top: "Nützlicher Körperteil", bottom: "Nutzloser Körperteil" },
  { top: "Wichtig in der Geschichte", bottom: "Unwichtig in der Geschichte" },
  { top: "Hochwertig", bottom: "Schlechte Qualität" },
  { top: "Brauchen", bottom: "Mögen" },
  { top: "Wunderschönes Wort", bottom: "Hässliches Wort" },
  { top: "Gefährlich", bottom: "Ungefährlich" },
  { top: "Einfach zu töten", bottom: "Schwer zu töten" },
  { top: "Überschätzter Buchstabe", bottom: "Unterschätzter Buchstabe" },
  { top: "Typisch deutsch", bottom: "Muss chinesisch sein" },
  { top: "Oft gemacht", bottom: "Selten gemacht" },
  { top: "Hübscher Mann", bottom: "Hässlicher Mann" },
  { top: "Bester Emoji", bottom: "Nutzloser Emoji" },
  { top: "Nützlich für dich", bottom: "Nützlich für die Gesellschaft" },
  { top: "Riecht super", bottom: "Uh, eklig" },
  { top: "Katzenname", bottom: "Hundename" },
  { top: "Kalt", bottom: "Heiß" }
];

const savePairs = (pairs) => {
  localStorage.setItem('wavelengthPairs', JSON.stringify(pairs));
};

const getRandomIndex = (length, exclude) => {
  if (length <= 1) return 0;
  let index;
  do {
    index = Math.floor(Math.random() * length);
  } while (index === exclude);
  return index;
};

const Wavelength = () => {
  const { translations } = useContext(LanguageContext);

  const [pairs, setPairs] = useState(() => {
    const stored = localStorage.getItem('wavelengthPairs');
    return stored ? JSON.parse(stored) : DEFAULT_PAIRS;
  });

  const [phase, setPhase] = useState('config');
  const [topWord, setTopWord] = useState('');
  const [bottomWord, setBottomWord] = useState('');
  const [correctPos, setCorrectPos] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [newTop, setNewTop] = useState('');
  const [newBottom, setNewBottom] = useState('');
  const [lastIndex, setLastIndex] = useState(null);
  const [positionStats, setPositionStats] = useState(Array(9).fill(0));

  useEffect(() => {
    savePairs(pairs);
  }, [pairs]);

  const startGame = () => {
    if (pairs.length === 0) return;
    const index = getRandomIndex(pairs.length, lastIndex);
    const pair = pairs[index];
    setTopWord(pair.top);
    setBottomWord(pair.bottom);

    const weightedPositions = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8];
    const randomPos = weightedPositions[Math.floor(Math.random() * weightedPositions.length)];
    setCorrectPos(randomPos);

    setPositionStats((prev) => {
      const updated = [...prev];
      updated[randomPos]++;
      return updated;
    });

    setSelectedPos(null);
    setLastIndex(index);
    setPhase('show');
  };

  const addPair = () => {
    if (newTop.trim() && newBottom.trim()) {
      const updated = [...pairs, { top: newTop.trim(), bottom: newBottom.trim() }];
      setPairs(updated);
      setNewTop('');
      setNewBottom('');
    }
  };

  const resetPairs = () => {
    localStorage.removeItem('wavelengthPairs');
    setPairs(DEFAULT_PAIRS);
    setLastIndex(null);
    setPositionStats(Array(9).fill(0));
  };

  const handleGuess = (index) => {
    setSelectedPos(index);
    setPhase('result');
  };

  const nextRound = () => {
    startGame();
  };

  if (phase === 'config') {
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
        <button className="btn-primary" disabled={pairs.length === 0} onClick={startGame}>
          {translations.startGame}
        </button>
      </div>
    );
  }

  return (
    <div className="wavelength-game">
      <h2>{topWord}</h2>
      <div className="scale">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`zone ${selectedPos === i ? 'selected' : ''}`}
            onClick={() => phase === 'guess' && handleGuess(i)}
          >
            {phase === 'show' && i === correctPos && <div className="marker black" />}
            {phase === 'result' && i === correctPos && <div className="marker black" />}
            {phase === 'result' && i === selectedPos && <div className="marker red" />}
          </div>
        ))}
      </div>
      <h2>{bottomWord}</h2>

      {phase === 'show' && <button onClick={() => setPhase('guess')}>{translations.continue}</button>}

      {phase === 'result' && (
        <>
          <button className="btn-primary" onClick={nextRound}>{translations.newRound}</button>
          <button onClick={() => window.location.href = '/'}>{translations.home}</button>
        </>
      )}
    </div>
  );
};

export default Wavelength;
