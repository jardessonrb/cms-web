"use client";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  columns?: string;
  expandContent?: React.ReactNode;
  isExpanded?: boolean;
};

export function DataRow({
  children,
  columns,
  style,
  expandContent,
  isExpanded = false,
}: Props) {
  return (
    <>
      <div style={{ ...styles.row, gridTemplateColumns: columns, ...style }}>
        {children}
      </div>

      {isExpanded && expandContent && (
        <div style={styles.expandRow}>
          {expandContent}
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: "grid",
    backgroundColor: "var(--color-bg)",
    padding: "12px",
    borderRadius: "10px",
    alignItems: "center",
    transition: "background 0.2s ease",
    marginBottom: "5px",
    marginTop: "2px",
    minHeight: "80px",
  },
  expandRow: {
    width: "100%",
    backgroundColor: "var(--color-bg)",
    // backgroundColor: "#f7ff",
    padding: "0px 5px",
    borderRadius: "10px 10px 10px 10px",
    marginTop: "-18px",
    marginBottom: "8px",
  },
};
