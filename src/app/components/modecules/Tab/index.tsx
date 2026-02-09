"use client";

import React, { useState } from "react";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export function Tab({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            style={{
              ...styles.tabButton,
              ...(active === index ? styles.active : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tabs[active].content}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: "95%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    marginTop: "20px"
  },
  header: {
    display: "flex",
    gap: "8px",
    borderBottom: "1px solid var(--color-bg-light)",
    marginLeft: 10
    // paddingBottom: "8px",
  },
  tabButton: {
    all: "unset",
    cursor: "pointer",
    padding: "8px 14px",
    borderRadius: "6px 6px 0 0",
    backgroundColor: "#e5e7eb",
    color: "#111827",
  },
  active: {
    backgroundColor: "var(--color-primary)",
    color: "#fff",
    fontWeight: 600,
  },
  content: {
    flex: 1,
    padding: "16px",
    backgroundColor: "var(--color-bg-light)",
    borderRadius: 20
  },
};
