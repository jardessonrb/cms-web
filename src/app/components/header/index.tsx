"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [title, setTitle] = useState("CMS");
  const userName = "Jardesson"; // mock por enquanto


  useEffect(() => {
    setTitle(document.title.replace("CMS | ", ""));
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.left}>CMS</div>
      <div style={styles.right}>{userName}</div>
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
