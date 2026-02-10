"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface InlineEditableProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  editClassName?: string;
}

export default function InlineEditable({
  value,
  onChange,
  placeholder,
  className = "",
  multiline = false,
  editClassName = "",
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text
      if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.selectionStart = 0;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      } else {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (draft !== value) {
      onChange(draft);
    }
  }, [draft, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setDraft(value);
        setIsEditing(false);
      }
      if (e.key === "Enter" && !multiline) {
        handleBlur();
      }
    },
    [value, multiline, handleBlur],
  );

  if (isEditing) {
    const inputClass = `bg-transparent border-none outline-none w-full text-center resize-none ${editClassName || className}`;

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputClass}
          rows={4}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={inputClass}
      />
    );
  }

  const isEmpty = !value || value.trim() === "";

  return (
    <span
      onClick={() => setIsEditing(true)}
      className="cursor-text inline-block rounded-lg transition-all duration-200 border border-dashed border-white/20 hover:border-white/50 hover:bg-white/10 px-2 -mx-2 py-0.5 group relative"
      title="Click to edit"
    >
      {isEmpty ? (
        <span className="opacity-50 italic">{placeholder}</span>
      ) : (
        <span className={className}>{value}</span>
      )}
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white/70 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Click to edit
      </span>
    </span>
  );
}
