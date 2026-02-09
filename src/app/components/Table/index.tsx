"use client";

import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onView?: (row: T) => void;
};

export function Table<T extends { id: string }>({
  data,
  columns,
  onView,
}: TableProps<T>) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessor)} style={styles.th}>
              {col.header}
            </th>
          ))}
          {onView && <th style={styles.th}>Ações</th>}
        </tr>
      </thead>
      <tbody style={styles.tbodyStyle}>
        {data.map((row) => (
          <tr key={row.id} style={styles.trLine}>
            {columns.map((col) => (
              <td key={String(col.accessor)} style={styles.td}>
                {String(row[col.accessor])}
              </td>
            ))}
            {onView && (
              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => onView(row)}
                >
                  Visualizar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles: Record<string, React.CSSProperties> = {
  table: {
    width: "100%",
    marginTop: "16px",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  tbodyStyle: {
    backgroundColor: "var(--color-bg)"
  },
  trLine: {
    borderRadius: "10px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "var(--color-primary)",
    color: "#fff",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "var(--color-blue)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
