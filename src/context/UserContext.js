import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // {id, name} | null

  useEffect(() => {
    const cached = localStorage.getItem("tempUser");
    if (cached) setUser(JSON.parse(cached));
  }, []);

  const createTempUser = (name) => {
    const u = { id: crypto.randomUUID(), name: name.trim() };
    setUser(u);
    localStorage.setItem("tempUser", JSON.stringify(u));
    return u;
  };
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("tempUser");
  };

  return <Ctx.Provider value={{ user, createTempUser, clearUser }}>{children}</Ctx.Provider>;
}

export const useUser = () => useContext(Ctx);
