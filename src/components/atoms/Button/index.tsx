"use client";

import React, { HTMLAttributes } from "react";

type Props = {
    style?: React.CSSProperties,
    mensagem: string,
    act?: () => void
    isDisable?: boolean
}

export function Button({ mensagem, style, act, isDisable = false}: Props) {
  return (
        <button style={{...styles.button, ...style}} disabled={isDisable} onClick={act}>
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
    height: "30px"
  }
};