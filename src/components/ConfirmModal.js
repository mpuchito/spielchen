import React from "react";

export default function ConfirmModal({ open, title, message, onAccept, onCancel }) {
  if (!open) return null;
  const safeTitle = title || "Confirmar";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-sm">
        <h3 className="font-semibold text-lg mb-2">{safeTitle}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1.5 rounded border" onClick={onCancel}>Cancelar</button>
          <button className="px-3 py-1.5 rounded bg-blue-600 text-white" onClick={onAccept}>Aceptar</button>
        </div>
      </div>
    </div>
  );
}
