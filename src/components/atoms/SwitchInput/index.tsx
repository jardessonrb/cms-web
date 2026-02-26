"use client";

import React from "react";

type SwitchInputProps = {
  value?: boolean;
  onChange?: (value: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  style?: React.CSSProperties;
  disabled?: boolean; // 🔹 novo
};

export function SwitchInput({
  value = false,
  onChange,
  labelOn = "Habilitado",
  labelOff = "Desabilitado",
  style,
  disabled = false,
}: SwitchInputProps) {

  function toggle() {
    if (disabled) return; // 🔒 bloqueia interação
    onChange?.(!value);
  }

  return (
    <div
      style={{
        ...styles.container,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      onClick={toggle}
    >
      <div
        style={{
          ...styles.switch,
          backgroundColor: value
            ? "var(--color-confirm)"
            : "#d1d5db",
        }}
      >
        <div
          style={{
            ...styles.circle,
            transform: value ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </div>

      <span style={styles.label}>
        {value ? labelOn : labelOff}
      </span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    userSelect: "none",
  },

  switch: {
    width: "42px",
    height: "22px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s",
  },

  circle: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    transition: "transform 0.2s",
  },

  label: {
    fontSize: "14px",
    color: "#1f2933",
    fontWeight: "500",
  },
};