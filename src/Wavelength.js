import React, { useState, useEffect } from 'react';
import './Wavelength.css';

const DEFAULT_PAIRS = [
  { top: "Kalt", bottom: "Heiß" },
  { top: "Groß", bottom: "Klein" },
  { top: "Schnell", bottom: "Langsam" },
  { top: "Intelligent", bottom: "Dumm" },
  { top: "Natürlich", bottom: "Künstlich" },
  { top: "Alt", bottom: "Modern" },
  { top: "Gesund", bottom: "Ungesund" },
  { top: "Weich", bottom: "Rau" },
  { top: "Dunkel", bottom: "Hell" },
  { top: "Billig", bottom: "Teuer" },
  { top: "Privat", bottom: "Öffentlich" },
  { top: "Kindisch", bottom: "Erwachsen" },
  { top: "Leise", bottom: "Laut" },
  { top: "Einfach", bottom: "Komplex" },
  { top: "Stark", bottom: "Schwach" },
  { top: "Vertrauenswürdig", bottom: "Verdächtig" },
  { top: "Freundlich", bottom: "Feindlich" },
  { top: "Realistisch", bottom: "Fantastisch" },
  { top: "Mainstream", bottom: "Alternativ" },
  { top: "Normal", bottom: "Seltsam" },
  { top: "Moralisch", bottom: "Unmoralisch" },
  { top: "Schön", bottom: "Hässlich" },
  { top: "Entspannt", bottom: "Gestresst" },
  { top: "Emotional", bottom: "Rational" },
  { top: "Konservativ", bottom: "Progressiv" },
  { top: "Flexibel", bottom: "Starr" },
  { top: "Grob", bottom: "Höflich" },
  { top: "Schwer", bottom: "Leicht" },
  { top: "Gewöhnlich", bottom: "Selten" },
  { top: "Praktisch", bottom: "Theoretisch" },
  { top: "Kreativ", bottom: "Logisch" },
  { top: "Leidenschaftlich", bottom: "Kühl" },
  { top: "Komisch", bottom: "Tragisch" },
  { top: "Direkt", bottom: "Indirekt" },
  { top: "Bekannt", bottom: "Unbekannt" },
  { top: "Vertraut", bottom: "Exotisch" },
  { top: "Traditionell", bottom: "Innovativ" },
  { top: "Verantwortlich", bottom: "Verantwortungslos" },
  { top: "Sichtbar", bottom: "Versteckt" },
  { top: "Spontan", bottom: "Geplant" },
  { top: "Optimistisch", bottom: "Pessimistisch" },
  { top: "Frei", bottom: "Eingeschränkt" },
  { top: "Ethnisch korrekt", bottom: "Unethisch" },
  { top: "Beliebt", bottom: "Unbeliebt" },
  { top: "Formell", bottom: "Informell" },
  { top: "Zart", bottom: "Grob" },
  { top: "Großmaßstäbig", bottom: "Kleinmaßstäbig" },
  { top: "Klassisch", bottom: "Modern" },
  { top: "Wörtlich", bottom: "Metaphorisch" },
  { top: "Offensichtlich", bottom: "Verschlüsselt" },
  { top: "Logisch", bottom: "Unlogisch" }
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
  const [pairs, setPairs] = useState(() => {
    const stored = localStorage.getItem('wavelengthPairs');
    return stored ? JSON.parse(stored) : DEFAULT_PAIRS;
  });

  const [phase, setPhase] = useState('config'); // config | show | guess | result
  const [topWord, setTopWord] = useState('');
  const [bottomWord, setBottomWord] = useState('');
  const [correctPos, setCorrectPos] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [newTop, setNewTop] = useState('');
  const [newBottom, setNewBottom] = useState('');
  const [lastIndex, setLastIndex] = useState(null);

  useEffect(() => {
    savePairs(pairs);
  }, [pairs]);

  const startGame = () => {
    if (pairs.length === 0) return;
    const index = getRandomIndex(pairs.length, lastIndex);
    const pair = pairs[index];
    setTopWord(pair.top);
    setBottomWord(pair.bottom);
    setCorrectPos(Math.floor(Math.random() * 7));
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
        <h2>Wortpaare konfigurieren</h2>
        <input
          placeholder="Wort oben"
          value={newTop}
          onChange={(e) => setNewTop(e.target.value)}
        />
        <input
          placeholder="Wort unten"
          value={newBottom}
          onChange={(e) => setNewBottom(e.target.value)}
        />
        <button onClick={addPair}>Paar hinzufügen</button>
        <button onClick={resetPairs}>Alle Paare löschen</button>
        <button className="btn-primary" disabled={pairs.length === 0} onClick={startGame}>
          Spiel starten
        </button>
      </div>
    );
  }

  return (
    <div className="wavelength-game">
      <h2>{topWord}</h2>
      <div className="scale">
        {[...Array(7)].map((_, i) => (
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
      {phase === 'show' && <button onClick={() => setPhase('guess')}>Weiter</button>}
      {phase === 'result' && (
        <>
          <button className="btn-primary" onClick={nextRound}>Neue Runde</button>
          <button onClick={() => window.location.href = '/'}>Startseite</button>
        </>
      )}
    </div>
  );
};

export default Wavelength;