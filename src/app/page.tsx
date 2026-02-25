"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if(isAuthenticated){
    router.push("/campeonatos")
  }

  return (
    <div style={styles.container}>
      {/* 🔸 Imagem */}
      <div style={styles.left}>
        <Image
          src="/imagem4v2.png"
          alt="Capoeira CMS"
          width={700}
          height={700}
          style={styles.image}
          priority
        />
      </div>

      {/* 🔸 Conteúdo */}
      <div style={styles.right}>
        <div style={styles.badge}>CMS</div>

        <h1 style={styles.title}>
          <span style={styles.highlight}>CMS</span> Championship Manager System
        </h1>

        <p style={styles.description}>
          Organize campeonatos de forma simples e eficiente. Gerencie atletas,
          categorias e fases com uma plataforma moderna, rápida e pensada para
          facilitar o seu fluxo.
        </p>

        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => router.push("/login")}
          >
            <LogIn size={18} />
            Entrar
          </button>

          {/* <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => router.push("/register")}
          >
            <UserPlus size={18} />
            Registrar
          </button> */}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    width: "100vw",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "calc(100vh - 80px)",
    padding: "60px 80px",
    backgroundColor: "var(--color-bg-light)",
    gap: "40px",
  },

  left: {
    flex: 1.2,
    display: "flex",
    justifyContent: "center",
  },

  image: {
    maxWidth: "100%",
    height: "auto",
    transform: "scale(1.1)",
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "520px",
  },

  badge: {
    backgroundColor: "rgba(249,115,22,0.1)",
    color: "var(--color-primary)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    width: "fit-content",
  },

  title: {
    fontSize: "36px",
    fontWeight: 700,
    color: "var(--color-text)",
    lineHeight: "1.2",
  },

  highlight: {
    color: "var(--color-primary)",
  },

  description: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--color-text)",
    lineHeight: "1.7",
  },

  actions: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginTop: "10px",
    marginRight: "20px"
  },

  button: {
    all: "unset",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  primaryButton: {
    backgroundColor: "var(--color-confirm)",
    color: "#fff",
  },

  secondaryButton: {
    backgroundColor: "var(--color-primary)",
    color: "#fff",
  },
};