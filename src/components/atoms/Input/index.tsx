"use client";

import React, { ChangeEvent, HTMLAttributes } from "react";

type InputProps = {
  placeholder?: string;
  value?: string | undefined;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  type?: string;
};

export function Input({
  placeholder,
  value,
  onChange,
  style,
  type = "text",
}: InputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value);
  }

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      style={{ ...styles.input, ...style }}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    transition: "border 0.2s",
  },
};
