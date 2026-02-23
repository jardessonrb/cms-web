"use client";

import React from "react";
import { Spinner } from "../Spinner";

type Props = {
  style?: React.CSSProperties;
  mensagem: string;
  act?: () => void;
  isDisable?: boolean;
  isLoading?: boolean;
};

export function Button({
  mensagem,
  style,
  act,
  isDisable = false,
  isLoading = false,
}: Props) {
  return (
    <button
      style={{ ...styles.button, ...style }}
      disabled={isDisable || isLoading}
      onClick={act}
    >
      {isLoading ? <Spinner /> : mensagem}
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
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // minWidth: "80px",
  }
};