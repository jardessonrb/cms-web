"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CampeonatoDetalhadoDto } from "@/types/campeonato";

type CampeonatoContextType = {
  campeonato: CampeonatoDetalhadoDto | null;
  setCampeonato: (c: CampeonatoDetalhadoDto | null) => void;
  clearCampeonato: () => void;
};

const CampeonatoContext = createContext<CampeonatoContextType | undefined>(undefined);

export function CampeonatoProvider({ children }: { children: React.ReactNode }) {
  const [campeonato, setCampeonatoState] = useState<CampeonatoDetalhadoDto | null>(null);

  function setCampeonato(c: CampeonatoDetalhadoDto | null) {
    setCampeonatoState(c);
    if (c) {
      sessionStorage.setItem("campeonato", JSON.stringify(c));
    }
  }

  function clearCampeonato() {
    setCampeonatoState(null);
    sessionStorage.removeItem("campeonato");
  }

  useEffect(() => {
    const salvo = sessionStorage.getItem("campeonato");
    if (salvo) setCampeonatoState(JSON.parse(salvo));
  }, []);

  return (
    <CampeonatoContext.Provider value={{ campeonato, setCampeonato, clearCampeonato }}>
      {children}
    </CampeonatoContext.Provider>
  );
}

export function useCampeonato() {
  const ctx = useContext(CampeonatoContext);
  if (!ctx) throw new Error("useCampeonato must be used within CampeonatoProvider");
  return ctx;
}
