import { useState, useEffect } from "react";

export default function TextInputModal({ open, title, label, initial="", confirmLabel="Aceptar", cancelLabel="Cancelar", onConfirm, onClose }) {
  const [val, setVal] = useState(initial);
  useEffect(()=>{ if(open) setVal(initial); },[open, initial]);

  if (!open) return null;
  return (
    <div className="ui-backdrop">
      <div className="ui-modal">
        <h3 className="ui-modal__title">{title}</h3>
        <label className="ui-field">
          <span className="ui-label">{label}</span>
          <input className="ui-input" value={val} onChange={e=>setVal(e.target.value)} autoFocus />
        </label>
        <div className="ui-actions">
          <button className="btn btn--primary" onClick={()=>onConfirm(val)}>{confirmLabel}</button>
          <button className="btn btn--ghost" onClick={onClose}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}
