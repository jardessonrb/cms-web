"use client";
import React from "react";

type CardTitleProps = {
  children: React.ReactNode;
};

export function CardTitle({ children }: CardTitleProps) {
  return (
    <div style={styles.card}>
      {children}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    width: "95%",
    minHeight: "150px",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    backgroundColor: "var(--color-bg-light)",
    borderRadius: 20,
    marginTop: 10
  }
};
