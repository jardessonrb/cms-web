"use client";

import React from "react";

type PaginationProps = {
  totalPages: number;
  currentPage: number; // base 0 (Spring Boot padrão)
  onPageChange: (page: number) => void;
  maxVisible?: number; // quantas páginas mostrar (default 4)
};

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisible = 4,
}: PaginationProps) {
  const startPage = Math.floor(currentPage / maxVisible) * maxVisible;
  const endPage = Math.min(startPage + maxVisible, totalPages);

  const pages = [];
  for (let i = startPage; i < endPage; i++) {
    pages.push(i);
  }

  const canGoBack = startPage > 0;
  const canGoForward = endPage < totalPages;

  return (
    <div style={styles.container}>
      <button
        style={styles.button}
        disabled={!canGoBack}
        onClick={() => onPageChange(startPage - 1)}
      >
        {"<<"}
      </button>
      {pages.map((page) => (
        <button
          key={page}
          style={{
            ...styles.button,
            ...(page === currentPage ? styles.active : {}),
          }}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </button>
      ))}

      <button
        style={styles.button}
        disabled={!canGoForward}
        onClick={() => onPageChange(endPage)}
      >
        {">>"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    gap: "6px",
    marginTop: "16px",
    alignItems: "center",
  },
  button: {
    all: "unset",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    fontSize: "14px",
    minWidth: "32px",
    textAlign: "center",
  },
  active: {
    backgroundColor: "var(--color-confirm)",
    color: "#fff",
    fontWeight: 600,
  },
};
