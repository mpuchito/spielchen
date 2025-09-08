import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";
import { WordleGame } from "./WordleGame";
import { useNavigate } from "react-router-dom";

export default function SolveWord() {
  const nav = useNavigate();
  const { lang, translations } = useLanguage();
  const t = translations.wordle || {};
  const langSafe = lang || "es";

  const [list, setList] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  // ref del contenedor para calcular las casillas
  const rootRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_words")
        .select("id, word_norm, language, created_by_name, created_at")
        .eq("language", langSafe)
        .gte("created_at", new Date(Date.now() - 72 * 3600 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(100);
      const arr = data || [];
      setList(arr);
      setIdx(0);
      setAnswer(arr[0] ? { ...arr[0], word: arr[0].word_norm } : null);
      setLoading(false);
    })();
  }, [langSafe]);

  const nextWord = () => {
    if (!list.length) return;
    setIdx((i) => {
      const n = (i + 1) % list.length;
      const w = list[n];
      setAnswer({ ...w, word: w.word_norm });
      return n;
    });
  };

  // calcula tamaño de casilla en función del alto disponible
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    function layout() {
      // alto total real del viewport móvil
      const vh = Math.max(window.innerHeight, document.documentElement.clientHeight);
      // restar altura aprox. de header + acciones + márgenes
      const headerH = 56;
      const actionsH = 0; // botones están en la barra superior
      const gaps = 48;
      const availableH = vh - headerH - actionsH - gaps;

      // espacio horizontal útil
      const w = el.clientWidth - 24;

      // tablero 6 filas x 5 columnas
      const byHeight = Math.floor(availableH / 6);
      const byWidth = Math.floor(w / 5);
      const tile = Math.max(28, Math.min(byHeight, byWidth, 64)); // clamp 28–64px

      el.style.setProperty("--tile", `${tile}px`);
    }

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [answer]);

  return (
    // usar 100dvh/100svh para móviles. inline style para compatibilidad.
    <div
  ref={rootRef}
  style={{
    height: "100dvh",
    minHeight: "100svh",
    padding: 12,
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",          // <-- centra TODO
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>
      {/* barra superior con título y acciones para no empujar el teclado */}
      <div className="flex flex-col items-center gap-2 mb-4 text-center">
	  <h2 className="text-base font-semibold leading-tight">
		{answer
		  ? `${t.resolver} ${t.de} ${answer.created_by_name} ${t.del_dia} ${new Date(
			  answer.created_at
			).toLocaleDateString()}`
		  : t.resolver}
	  </h2>
	  <div className="flex gap-3">
		<button className="btn-secondary h-9 px-4" onClick={() => nav("/wordle/crear")}>
		  {t.crear || "Crear"}
		</button>
		<button className="btn-primary h-9 px-4" onClick={nextWord}>
		  {t.siguiente || "Siguiente"}
		</button>
	  </div>
	  </div>


      {/* el juego ocupa el resto sin scroll de página */}
      <div className="flex-1 overflow-hidden">
        {loading && <p className="text-sm">Cargando…</p>}
        {!loading && !answer && <p className="text-sm">No hay palabras recientes.</p>}
        {answer && (
          <WordleGame
            key={`${answer.id}-${idx}`}
            answer={answer}
            lang={langSafe}
            // hace que el teclado quede pegado abajo
            className="wordle-root h-full"
          />
        )}
      </div>
    </div>
  );
}
