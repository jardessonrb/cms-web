"use client";

import { Eye, FileUp, NotebookPen, SquareChevronDown, SquareChevronUp, SquarePen } from "lucide-react";
import React from "react";

export type ButtonIconType = "UPDATE" | "OPEN" | "IMPORT" | "DOWN" | "UP" | "REGISTER" | "NONE";

type ButtonIconProps = {
  style?: React.CSSProperties;
  mensagem?: string;
  act?: () => void;
  isDisable?: boolean;
  isLoading?: boolean;
  type: ButtonIconType
};

function selectIconByType(type: ButtonIconType) : React.ReactElement {
    if(type === "UPDATE"){
        return <SquarePen />
    }

    if(type === "OPEN"){
        return <Eye />
    }

    if(type === "IMPORT"){
      return <FileUp />
    }

    if(type === "DOWN"){
      return <SquareChevronDown />
    }

    if(type === "UP"){
      return <SquareChevronUp />
    }

    if(type === "REGISTER"){
      return <NotebookPen color="var(--color-confirm)" />
    }

    return <></>
}

export function ButtonIcon({
  mensagem,
  style,
  act,
  isDisable = false,
  isLoading = false,
  type
}: ButtonIconProps) {

    
    return (
        <button
            style={{...styles.button, ...style }}
            disabled={isDisable || isLoading}
            onClick={act}
        >
            <div style={styles.buttonContent}>
                <>{selectIconByType(type)}</>
                <span style={{}}>{mensagem ? mensagem : ""}</span>
            </div>

        </button>
    );
}



const styles: Record<string, React.CSSProperties> = {
  button: {
    all: "unset",
    // backgroundColor: "var(--color-bg-light)",
    color: "var(--color-confirm)",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 500,
    textAlign: "center",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40px",
  },
  buttonContent: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    gap: "5px"
  }
};