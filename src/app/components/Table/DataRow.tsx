"use client";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  columns?: string; // ex: "2fr 1fr 1fr"
};

export function DataRow({ children, columns, style}: Props) {
  return <div 
        style={{...styles.row, gridTemplateColumns: columns, ...style}}>{
        children}
      </div>;
}

const styles: Record<string, React.CSSProperties> = {
    row: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        backgroundColor: "var(--color-bg)",
        padding: "12px",
        borderRadius: "10px",
        alignItems: "center",
        transition: "background 0.2s ease",
        marginBottom: "5px",
        marginTop: "2px",
        minHeight: "80px"
    }
};
