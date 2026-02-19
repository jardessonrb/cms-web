"use client";

import { useAuth } from "@/context/AuthContext";
import { use, useEffect, useState } from "react";

export default function Header() {
  const { user, logout, isAuthenticated, login } = useAuth();
  const [title, setTitle] = useState("CMS");
  const userName = "Jardesson"; // mock por enquanto


  useEffect(() => {
    login({token: "algum token aqui", user: {id: "", nome: "Járdesson", email: "jardesson@cms.com"}})
    setTitle(document.title.replace("CMS | ", ""));
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.left}>CMS</div>
      {isAuthenticated ? (<div style={styles.right}>{`Olá, ${user?.nome}`}</div>) : (<p>Deslogado</p>)}
      
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    width: '100%',
    height: "60px",
    backgroundColor: "var(--color-primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    fontWeight: 500,
  },
  left: {
    fontSize: "1.2rem",
    letterSpacing: "0.05em",
  },
  center: { justifySelf: "center", fontSize: "1rem", opacity: 0.9 },
  right: {
    fontSize: "0.95rem",
    opacity: 0.9,
  },
};
