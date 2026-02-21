"use client";
import React from "react";

export type SituacaoType = "CONFIRM" | "SUCCESS" | "ALERT" | "DANGER" 

type SituacaoEstilizadaProps = {
  children: string;
  funcType: (situacao: string) => SituacaoType;
};

export function SituacaoEstilizada({ children, funcType }: SituacaoEstilizadaProps) {
  return (
    <div style={{...styles.container,...styles[funcType(children)]}}>
      <span style={styles.children}>{children}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        justifyContent: 'center',
        padding: "10px",
        minWidth:  "150px",
        borderRadius: "10px"
    },
    children: {
        fontWeight: "bold"
    },
    CONFIRM: {
       color: "var(--color-confirm)",
       border: "1px solid var(--color-confirm)",
    },
    SUCCESS: {
       color: "var(--color-success)",
       border: "1px solid var(--color-success)",
    },
    ALERT: {
        color: "var(--color-primary)",
        border: "1px solid var(--color-primary)",
    },
    DANGER: {
        color: "var(--color-error)",
        border: "1px solid var(--color-error)",
    }
};