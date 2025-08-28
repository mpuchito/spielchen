import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ConfirmModal from "../components/ConfirmModal";
import TextInputModal from "../components/TextInputModal";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";   // 👈 traemos el contexto
import "./QuePrefieres.css";

const flattenPresence = (state) => {
  const byKey = new Map();
  for (const [key, metas] of Object.entries(state)) {
    if (!metas?.length) continue;
    const m = metas[metas.length - 1];
    byKey.set(key, { key, ...m });
  }
  return [...byKey.values()];
};

export default function QuePrefieres() {
  const { user } = useUser();                    // 👈 ya no prop
  const { translations } = useLanguage?.() ?? { translations: { qp: {} } };
  const t = translations.qp || {
    createRoom: "Crear sala", inviteTo: "Invitar a {room}", roomLabel: "Sala",
    leave: "Salir", roomHint: "Crea o acepta una invitación para entrar a una sala.",
    clear: "Quitar", reveal: "Revelar resultados", hide: "Ocultar resultados",
    connected: "Conectados", votes: "Votos", inRoom: "En la sala", voted: "votó",
    notVoted: "sin votar", inviteTitle: "Invitación a sala", inviteMsg: "te invita a la sala",
    createTitle: "Crear sala", createLabel: "Nombre de la sala", createCta: "Crear",
    cancel: "Cancelar", joinFirst: "Crea/únete a una sala primero."
  };

  const [room, setRoom] = useState("lobby");
  const [vote, setVote] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [roomReady, setRoomReady] = useState(false);

  const [lobbyCh, setLobbyCh] = useState(null);
  const [roomCh, setRoomCh] = useState(null);
  const [lobbyPeers, setLobbyPeers] = useState([]);
  const [roomPeers, setRoomPeers] = useState([]);

  const [inviteData, setInviteData] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Lobby: presence + invitaciones
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("lobby", { config: { presence: { key: user.id } } });

    ch.on("presence", { event: "sync" }, () => {
      setLobbyPeers(flattenPresence(ch.presenceState()));
    });

    ch.on("broadcast", { event: "invite" }, (payload) => {
      const { toKey, roomName, from } = payload.payload || {};
      if (toKey !== user.id) return;
      setInviteData({ roomName, from });
      setInviteOpen(true);
    });

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ name: user.name, where: "lobby" });
        setLobbyCh(ch);
      }
    });

    return () => supabase.removeChannel(ch);
  }, [user]);

  // Crear / entrar sala
  const createRoom = () => setCreateOpen(true);

  const joinRoom = async (roomName) => {
    if (!roomName?.trim()) return;

    if (roomCh) {
      await roomCh.untrack();
      supabase.removeChannel(roomCh);
    }
    setVote(null);
    setRevealed(false);
    setRoomReady(false);

    const ch = supabase.channel(`room:${roomName}`, { config: { presence: { key: user.id } } });

    ch.on("presence", { event: "sync" }, async () => {
      setRoomPeers(flattenPresence(ch.presenceState()));

      if (roomReady && flattenPresence(ch.presenceState()).length === 0) {
        await ch.untrack();
        supabase.removeChannel(ch);
        setRoomCh(null);
        setRoomPeers([]);
        setVote(null);
        setRevealed(false);
        setRoomReady(false);
        setRoom("lobby");
        if (lobbyCh) {
          await lobbyCh.untrack();
          await lobbyCh.track({ name: user.name, where: "lobby" });
        }
      }
    });

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ name: user.name, vote: null, where: `room:${roomName}` });
        setRoom(roomName);
        setRoomCh(ch);
        if (lobbyCh) {
          await lobbyCh.untrack();
          await lobbyCh.track({ name: user.name, where: `room:${roomName}` });
        }
        setRoomReady(true);
      }
    });
  };

  // Invitar
  const invite = (targetKey) => {
    if (!roomCh) return alert(t.joinFirst);
    lobbyCh?.send({
      type: "broadcast",
      event: "invite",
      payload: { toKey: targetKey, roomName: room, from: user.name },
    });
  };

  // Voto
  const setMyVote = async (val) => {
    setVote(val);
    roomCh && roomCh.track({ name: user.name, vote: val, where: `room:${room}` });
  };
  const clearVote = async () => setMyVote(null);

  // Salir
  const leaveRoom = async () => {
    if (roomCh) {
      await roomCh.untrack();
      supabase.removeChannel(roomCh);
      setRoomCh(null);
    }
    setRoomPeers([]);
    setVote(null);
    setRevealed(false);
    setRoomReady(false);
    setRoom("lobby");
    if (lobbyCh) {
      await lobbyCh.untrack();
      await lobbyCh.track({ name: user.name, where: "lobby" });
    }
  };

  // Modales
  const acceptInvite = () => { if (inviteData?.roomName) joinRoom(inviteData.roomName); setInviteData(null); setInviteOpen(false); };
  const declineInvite = () => { setInviteData(null); setInviteOpen(false); };

  // Resultados
  const { a, b, total } = useMemo(() => {
    const votes = roomPeers.map((p) => p.vote).filter(Boolean);
    const a = votes.filter((v) => v === "A").length;
    const b = votes.filter((v) => v === "B").length;
    return { a, b, total: a + b };
  }, [roomPeers]);

  const pct = (n) => Math.round((n / Math.max(1, total)) * 100);

  if (!user) return null; // por si acaso

  return (
    <div className="qp-wrap">
      {/* Lobby */}
      <div className="qp-card">
        <div className="qp-head">
          <span className="badge">{t.connected}: {lobbyPeers.length}</span>
          <button className="qp-btn" onClick={createRoom}>{t.createRoom}</button>
        </div>

        <ul className="qp-list">
          {lobbyPeers.map((p) => (
            <li key={p.key} className="qp-li">
              <span className="qp-name">{p.name} {p.where !== "lobby" && <span className="qp-muted">· {p.where}</span>}</span>
              {room !== "lobby" && p.key !== user.id && p.where === "lobby" && (
                <button className="qp-link" onClick={() => invite(p.key)}>
                  {t.inviteTo.replace("{room}", room)}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Sala */}
      <div className="qp-card">
        <div className="qp-head">
          <span>{t.roomLabel}: {room}</span>
          {room !== "lobby" && (
            <button className="qp-link qp-ghost" onClick={leaveRoom}>{t.leave}</button>
          )}
        </div>

        {room === "lobby" ? (
          <div className="qp-muted">{t.roomHint}</div>
        ) : (
          <>
            <div className="qp-choice">
              <button className={vote === "A" ? "active" : ""} onClick={() => setMyVote("A")}>A</button>
              <button className={vote === "B" ? "active" : ""} onClick={() => setMyVote("B")}>B</button>
              <button className="qp-ghost" onClick={clearVote} disabled={vote === null}>{t.clear}</button>
            </div>

            <div className="qp-subrow">
              {!revealed ? (
                <button className="qp-link qp-ghost" onClick={() => setRevealed(true)}>{t.reveal}</button>
              ) : (
                <button className="qp-link qp-ghost" onClick={() => setRevealed(false)}>{t.hide}</button>
              )}
              <div className="qp-muted">{t.connected}: {roomPeers.length} · {t.votes}: {total}</div>
            </div>

            {revealed && (
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div className="qp-subrow"><span>A ({a})</span><span>{pct(a)}%</span></div>
                  <div className="qp-bar"><div style={{ width: `${pct(a)}%` }} /></div>
                </div>
                <div>
                  <div className="qp-subrow"><span>B ({b})</span><span>{pct(b)}%</span></div>
                  <div className="qp-bar"><div style={{ width: `${pct(b)}%` }} /></div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{t.inRoom}</div>
              <ul className="qp-list">
                {roomPeers.map((p) => (
                  <li key={p.key} className="qp-li">
                    <span className="qp-name">
                      {p.name} {p.vote ? (revealed ? `· ${p.vote}` : `· ${t.voted}`) : `· ${t.notVoted}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={inviteOpen}
        title={t.inviteTitle}
        message={`${inviteData?.from ?? ""} ${t.inviteMsg} "${inviteData?.roomName ?? ""}".`}
        onAccept={acceptInvite}
        onCancel={declineInvite}
      />

      <TextInputModal
        open={createOpen}
        title={t.createTitle}
        label={t.createLabel}
        confirmLabel={t.createCta}
        cancelLabel={t.cancel}
        onConfirm={(name) => { setCreateOpen(false); joinRoom(name); }}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
