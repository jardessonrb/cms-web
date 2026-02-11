"use client";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function DataTable({ children, style, ...rest }: Props) {
  return <div style={styles}>{children}</div>;
}

const styles: Record<string, React.CSSProperties> = {
    table: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    }
};
