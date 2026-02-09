"use client";

import React, { HTMLAttributes } from "react";

type Props = {
    style?: React.CSSProperties,
    mensagem: string,
    act?: () => void
}

export function Button({ mensagem, style, act }: Props) {
  return (
        <button style={{...styles.button, ...style}} onClick={act}>
            {mensagem}
        </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    all: "unset",  
    backgroundColor: "var(--color-confirm)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 500,
    textAlign: "center",
    height: "40px"
  }
};