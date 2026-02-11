"use client";

import React, { useEffect, useState } from "react";

type Props = {
  placeholder?: string;
  fetchOptions: (query: string) => Promise<SelectOption[]>;
  value?: SelectOption | null;
  onSelect: (option: SelectOption) => void;
};

export type SelectOption = {
  id: string;
  label: string;
};

export function AsyncSelect({
  placeholder,
  fetchOptions,
  value,
  onSelect,
}: Props) {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(value?.label || "");
  }, [value]);

  async function handleSearch(text: string) {
    setInputValue(text);
    if (!text) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const result = await fetchOptions(text);
    setOptions(result);
    setOpen(true);
    setLoading(false);
  }

  function handleSelect(option: SelectOption) {
    onSelect(option);
    setInputValue(option.label);
    setOptions([]);
    setOpen(false);
  }

  return (
    <div style={styles.wrapper}>
      <input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.input}
      />

      {open && options.length > 0 && (
        <div style={styles.dropdown}>
          {loading && <div style={styles.item}>Buscando...</div>}

          {options.map((opt) => (
            <div
              key={opt.id}
              style={styles.item}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "var(--color-bg-light)",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginTop: "4px",
    zIndex: 10,
    maxHeight: "180px",
    overflowY: "auto",
  },
  item: {
    padding: "8px 12px",
    cursor: "pointer",
  },
};
