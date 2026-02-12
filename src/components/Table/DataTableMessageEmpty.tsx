"use client";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function DataTableMessageEmpty({ children, style}: Props) {
  return <div style={{...styles.container, ...style}}>{children}</div>;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: "40px"
  }
};
