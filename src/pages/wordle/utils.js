const pick = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

export function getVisibleUserName({ user, presenceMeta }) {
  // No devuelvas "anon" aquí. Deja que el caller haga el fallback.
  return (
    pick(presenceMeta?.displayName) ||
    pick(user?.displayName) ||
    pick(user?.name) ||            // <- como en QuePrefieres
    pick(user?.username) ||
    (user?.email ? pick(user.email.split("@")[0]) : null)
  );
}

export function onlyLetters5(str) {
  return /^[a-zA-ZáéíóúüñÄÖÜäöüß]{5}$/.test(str);
}

export function normalizeWord(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("ß", "ss");
}

export function getTempName() {
  const pickVal = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

  const KEYS = [
    "tempUserName", "qp_user_name", "qp:name", "displayName",
    "username", "user_name", "name", "spielchen_username"
  ];

  for (const k of KEYS) {
    const v = pickVal(localStorage.getItem(k)) || pickVal(sessionStorage.getItem(k));
    if (v) return v;
  }

  const OBJ_KEYS = ["qp_user", "user", "presence", "currentUser"];
  for (const k of OBJ_KEYS) {
    try {
      const raw = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      const v =
        pickVal(obj?.name) ||
        pickVal(obj?.displayName) ||
        pickVal(obj?.username) ||
        pickVal(obj?.user?.name) ||
        pickVal(obj?.user?.displayName);
      if (v) return v;
    } catch {}
  }
  return null;
}
