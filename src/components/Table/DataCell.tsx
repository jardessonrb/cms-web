"use client";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function DataCell({ children, style}: Props) {
  return <div style={{...styles.cell, ...style}}>{children}</div>;
}

const styles: Record<string, React.CSSProperties> = {
  cell: {
    display: "flex",
    alignItems: "center",
  }
};
