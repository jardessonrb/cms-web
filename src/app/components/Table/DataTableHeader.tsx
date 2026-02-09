"use client";
import React, { HTMLAttributes } from "react";


type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  columns?: string;
};

export function DataTableHeader({ children, columns, style }: Props) {
  return (
        <div 
            style={{...styles.header, gridTemplateColumns: columns, ...style}}>
            {children}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    header: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        padding: "12px",
        backgroundColor: "var(--color-primary)",
        color: "var(--color-text)",
        // borderRadius: "10px",
        fontWeight: 500
    }
};
