"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      {/* 🔹 Lado esquerdo (imagem) */}
      <div style={styles.left}>
        <Image
          src="/imagem2v2.png"
          alt="Capoeira CMS"
          width={500}
          height={500}
          style={styles.image}
          priority
        />
      </div>

      {/* 🔹 Lado direito (conteúdo) */}
      <div style={styles.right}>
        <h1 style={styles.title}>Championship Manager System</h1>

        <p style={styles.description}>
          Gerencie campeonatos de forma simples e eficiente. O CMS permite
          organizar atletas, categorias, fases e resultados em um só lugar,
          trazendo mais controle e praticidade para competições esportivas.
        </p>

        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => router.push("/login")}
          >
            <LogIn size={18} />
            Entrar
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => router.push("/register")}
          >
            <UserPlus size={18} />
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 80px)", // desconta header
    padding: "40px",
    gap: "40px",
    backgroundColor: "var(--color-bg)",
  },

  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  image: {
    maxWidth: "100%",
    height: "auto",
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "500px",
  },

  title: {
    fontSize: "32px",
    fontWeight: 700,
    color: "var(--color-text)",
  },

  description: {
    fontSize: "16px",
    color: "var(--color-text)",
    lineHeight: "1.6",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },

  button: {
    all: "unset",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
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