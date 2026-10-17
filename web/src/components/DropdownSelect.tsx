'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa6';

export interface DropdownOption {
  value: string;
  /** główny tekst pozycji (też w polu po wyborze) */
  label: string;
  /** druga linia w liście, np. kod pocztowy i miasto */
  detail?: string;
}

/**
 * Rozwijana lista wyboru w stylu strony (zamiast systemowego <select>/<input type="time">):
 * lista ma szerokość pola, kolory strony, cienki złoty pasek przewijania. Zamyka się po wyborze,
 * kliknięciu obok, Esc/Tab; obsługa klawiaturą (strzałki, Home/End, Enter).
 */
export function DropdownSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  label,
  describedBy,
  className = '',
  buttonClassName,
  icon,
}: {
  id: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  /** nazwa listy dla czytników ekranu */
  label: string;
  describedBy?: string;
  className?: string;
  /** wygląd pola (jak inne pola formularza) */
  buttonClassName: string;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  // zamknięcie po kliknięciu poza listą
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  // po otwarciu fokus na liście; aktywna pozycja zawsze widoczna
  useEffect(() => {
    if (open) list.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const choose = (option: DropdownOption) => {
    onChange(option.value);
    setOpen(false);
    root.current?.querySelector('button')?.focus();
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            openList();
          }
        }}
        className={`${buttonClassName} flex items-center justify-between gap-3 text-left ${open ? 'border-gold' : ''}`}
      >
        <span className={`flex min-w-0 items-center gap-3 ${selected ? 'text-cream' : 'text-stone/70'}`}>
          {icon}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <FaChevronDown size={11} aria-hidden className={`shrink-0 text-stone transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          ref={list}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={(e) => {
            const move = (i: number) => {
              e.preventDefault();
              setActive(Math.min(options.length - 1, Math.max(0, i)));
            };
            if (e.key === 'ArrowDown') move(active + 1);
            else if (e.key === 'ArrowUp') move(active - 1);
            else if (e.key === 'Home') move(0);
            else if (e.key === 'End') move(options.length - 1);
            else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              choose(options[active]);
            } else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
          }}
          // bez obwódki fokusu – aktywna pozycja jest podświetlona
          className="scrollbar-subtle absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto border border-line bg-ink py-1 shadow-xl shadow-black/40"
          style={{ outline: 'none' }}
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={isSelected}
                data-active={i === active}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 tabular-nums transition-colors ${
                  i === active ? 'bg-coal' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className={`block ${isSelected ? 'text-gold' : 'text-cream'}`}>{option.label}</span>
                  {option.detail && <span className="block text-sm text-stone">{option.detail}</span>}
                </span>
                {isSelected && <FaCheck size={11} aria-hidden className="shrink-0 text-gold" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
