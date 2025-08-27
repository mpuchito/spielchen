import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import TextInputModal from "./TextInputModal";

export default function RequireTempName({ children }) {
  const { user, createTempUser } = useUser();
  const { translations } = useLanguage();
  const t = translations.user;

  const [open, setOpen] = useState(!user);

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
          setOpen(false);
        }}
        onClose={() => setOpen(true)} // no cerrar hasta crear
      />
    );
  }
  return children;
}
