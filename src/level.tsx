import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Level = "beginner" | "expert";

const LevelContext = createContext<{ level: Level; setLevel: (l: Level) => void }>({
  level: "beginner",
  setLevel: () => {},
});

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<Level>(() => {
    const saved = localStorage.getItem("compareai-level");
    return saved === "expert" ? "expert" : "beginner";
  });
  useEffect(() => {
    localStorage.setItem("compareai-level", level);
  }, [level]);
  return <LevelContext.Provider value={{ level, setLevel }}>{children}</LevelContext.Provider>;
}

export const useLevel = () => useContext(LevelContext);
