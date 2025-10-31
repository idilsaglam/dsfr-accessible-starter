// src/components/Combobox.tsx
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

export type Option = { id: string; label: string };
export type Props = {
  label: string;
  options: (Option | string)[];
  placeholder?: string;
  onChange?: (value: string) => void;   // returns label
  onSelect?: (opt: Option) => void;     // richer callback
  id?: string;
};

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const Combobox: React.FC<Props> = ({ label, options, placeholder = "Rechercher…", onChange, onSelect, id }) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const listboxId = `${inputId}-listbox`;
  const helpId = `${inputId}-help`;
  const liveId = `${inputId}-live`;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRefs = useRef<HTMLLIElement[]>([]);

  // Normalize strings -> {id,label}
  const normalized: Option[] = useMemo(
    () =>
      options.map((o, i) =>
        typeof o === "string" ? { id: `opt-${i}-${slug(o)}`, label: o } : o
      ),
    [options]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? normalized.filter(o => o.label.toLowerCase().includes(q)) : normalized;
  }, [query, normalized]);

  // Keep active option scrolled into view
  useEffect(() => {
    if (activeIndex < 0) return;
const node = optionsRefs.current[activeIndex];
// Guard both the node and the method in jsdom
node?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex]);

  // Close when focus leaves the whole widget
  useEffect(() => {
    function onFocusOut(e: FocusEvent) {
      if (!rootRef.current) return;
      const next = e.relatedTarget as Node | null;
      if (next && rootRef.current.contains(next)) return;
      setOpen(false);
      setActiveIndex(-1);
    }
    const el = rootRef.current;
    el?.addEventListener("focusout", onFocusOut);
    return () => el?.removeEventListener("focusout", onFocusOut);
  }, []);

  // Close on outside click (e.g., mouse)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function commitSelection(i: number) {
    const opt = filtered[i];
    if (!opt) return;
    onSelect?.(opt);
    onChange?.(opt.label);
    setQuery(opt.label);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(i => Math.min((i < 0 ? -1 : i) + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(i => Math.max((i < 0 ? filtered.length : i) - 1, 0));
        break;
      case "Home":
        if (open) { e.preventDefault(); setActiveIndex(0); }
        break;
      case "End":
        if (open) { e.preventDefault(); setActiveIndex(filtered.length - 1); }
        break;
      case "Enter":
        if (open && activeIndex >= 0) { e.preventDefault(); commitSelection(activeIndex); }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        } else if (query) {
          // second Esc clears the field (expected by many SR users)
          e.preventDefault();
          setQuery("");
          onChange?.("");
        }
        break;
    }
  }

  const activeId = activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;
  const resultsCountText =
    open ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}` : "";

  return (
    <div ref={rootRef} className="cbx-root" style={{ position: "relative" }}>
      <label className="fr-label" htmlFor={inputId}>{label}</label>
      <p id={helpId} className="fr-hint-text fr-mb-1w">
        Tapez pour filtrer la liste, utilisez les flèches pour naviguer.
      </p>
      {/* Live region announcing result count */}
      <div id={liveId} className="fr-sr-only" aria-live="polite" aria-atomic="true">
        {resultsCountText}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        className="fr-input"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-describedby={`${helpId} ${liveId}`}
        aria-activedescendant={activeId}
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck={false}
      />

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="cbx-listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: 240,
            overflow: "auto",
            listStyle: "none",
            margin: 0,
            padding: 4,
            background: "var(--background-default-grey, #fff)",
            border: "1px solid var(--border-default-grey, #ddd)",
            borderRadius: 4,
            boxShadow: "0 4px 16px rgba(0,0,0,.08)",
            zIndex: 1000
          }}
        >
          {filtered.length === 0 && (
            <li className="cbx-empty" role="status" aria-live="polite" style={{ padding: "8px 12px" }}>
              Aucun résultat
            </li>
          )}
          {filtered.map((o, i) => {
            const id = `${listboxId}-opt-${i}`;
            const active = i === activeIndex;
            return (
              <li
                id={id}
                key={o.id}
                role="option"
                aria-selected={active}
                ref={el => { if (el) optionsRefs.current[i] = el; }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => e.preventDefault()} // keep focus on input
                onClick={() => commitSelection(i)}
                className={`cbx-option${active ? " cbx-option--active" : ""}`}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: active ? "var(--background-action-low-blue-france, #eef5ff)" : undefined
                }}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Combobox;
