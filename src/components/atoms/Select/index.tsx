"use client";

import React, { ChangeEvent } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export function Select({
  value,
  onChange,
  options,
  placeholder,
  style,
  disabled = false,
}: SelectProps) {
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange?.(e.target.value);
  }

  return (
    <select
      value={value ?? ""}
      onChange={handleChange}
      disabled={disabled}
      style={{
        ...styles.select,
        ...(disabled ? styles.disabled : {}),
        ...style,
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

const styles: Record<string, React.CSSProperties> = {
  select: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    transition: "border 0.2s",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  disabled: {
    backgroundColor: "#f3f4f6",
    cursor: "not-allowed",
  },
};
