import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";
import { WordleGame } from "./WordleGame";
import { useNavigate } from "react-router-dom";

function Tag({ children, className = "" }) {
  return (
    <span className={`inline-block text-xs px-2 py-1 rounded border ${className}`}>
      {children}
    </span>
  );
}

export default function SolveWord() {
  const nav = useNavigate();
  const { lang, translations } = useLanguage();
  const t = translations.wordle || {};
  const langSafe = lang || "es";

  const [list, setList] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (list.length === 0) return;
    setIdx((i) => {
      const n = (i + 1) % list.length;
      const w = list[n];
      setAnswer({ ...w, word: w.word_norm });
      window.scrollTo(0, 0);
      return n;
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">
        {answer
          ? `${t.resolver} ${t.de} ${answer.created_by_name} ${t.del_dia} ${new Date(
              answer.created_at
            ).toLocaleDateString()}`
          : t.resolver}
      </h2>

      {loading && <p className="text-sm">Cargando…</p>}
      {!loading && !answer && <p className="text-sm">No hay palabras recientes.</p>}

      {answer && (
        <WordleGame
          key={`${answer.id}-${idx}`}   // remount al cambiar
          answer={answer}
          lang={langSafe}
        />
      )}

      <div className="wordle-bottom-actions">
        <button className="btn-secondary" onClick={() => nav("/wordle/crear")}>
          Crear palabra
        </button>
        <button className="btn-primary" onClick={nextWord}>
          Siguiente palabra
        </button>
      </div>
    </div>
  );
}
