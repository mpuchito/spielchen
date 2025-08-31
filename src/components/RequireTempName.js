// src/components/RequireTempName.js
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import TextInputModal from "./TextInputModal";

export default function RequireTempName({ children }) {
  const { user, createTempUser } = useUser();
  const { translations } = useLanguage();
  const t =
    translations.user || {
      createTitle: "Crear usuario temporal",
      createLabel: "Escribe tu nombre para jugar:",
      confirm: "Empezar",
      cancel: "Cancelar",
    };

  const [open, setOpen] = useState(!user);

  const persistTempName = (n) => {
    const v = (n || "").trim();
    if (!v) return;
    try {
      localStorage.setItem("tempUserName", v);
      localStorage.setItem("displayName", v);
      localStorage.setItem("qp_user_name", v); // compat
      sessionStorage.setItem("tempUserName", v);
    } catch {}
  };

  useEffect(() => {
    const existing =
      user?.displayName || user?.name || user?.username || null;
    if (existing) persistTempName(existing);
  }, [user]);

  if (!user) {
    return (
      <TextInputModal
        open={open}
        title={t.createTitle}
        label={t.createLabel}
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        onConfirm={(name) => {
          if (!name?.trim()) return;
          createTempUser(name);
          persistTempName(name);
          setOpen(false);
        }}
        onClose={() => setOpen(true)} // no cerrar hasta crear
      />
    );
  }
  return children;
}
