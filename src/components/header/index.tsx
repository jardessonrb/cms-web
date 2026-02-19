"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 🔹 Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.left}>CMS</div>

      {isAuthenticated ? (
        <div style={styles.right} ref={menuRef}>
          <div
            style={styles.userName}
            onClick={() => setOpen((prev) => !prev)}
          >
           {user?.nome ? ` Olá, ${user?.nome}` : ""}
          </div>

          {open && (
            <div style={styles.dropdown}>
              <button
                style={styles.logoutButton}
                onClick={() => {
                  logout(), 
                  setOpen(false),
                  router.replace("/login");
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Deslogado</p>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    width: "100%",
    height: "80px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    backgroundColor: "var(--color-primary)",
    borderBottom: "1px solid #e5e7eb",
    position: "relative",
  },
  left: {
    fontSize: "20px",
    fontWeight: 500,
    color: "var(--color-bg-light)"
  },
  right: {
    position: "relative",
    cursor: "pointer",
    paddingRight: "20px"
  },
  userName: {
    fontSize: "20px",
    fontWeight: 500,
    color: "var(--color-bg-light)"
  },
  dropdown: {
    position: "absolute",
    top: "35px",
    right: 50,
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    padding: "8px",
    minWidth: "150px",
    zIndex: 100,
  },
  logoutButton: {
    width: "100%",
    padding: "8px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
  },
};
