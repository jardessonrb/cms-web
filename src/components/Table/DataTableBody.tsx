"use client";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  maxHeight?: number | string;
};

export function DataTableBody({ children, maxHeight, style, ...rest }: Props) {
  return (
    <div
      {...rest}
      style={{
        overflowY: "auto",
        ...(maxHeight ? { maxHeight } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
