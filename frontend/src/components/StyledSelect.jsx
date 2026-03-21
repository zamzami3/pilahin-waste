"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

function normalizeOptions(options) {
  return options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        label: String(opt.label ?? opt.value ?? ""),
        value: opt.value,
        disabled: Boolean(opt.disabled),
      }
    }
    return {
      label: String(opt),
      value: opt,
      disabled: false,
    }
  })
}

export default function StyledSelect({
  label,
  value,
  onChange,
  onValueChange,
  options = [],
  placeholder = "Pilih opsi",
  disabled = false,
  name,
  className = "",
  menuClassName = "",
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options])
  const selectedOption = useMemo(
    () => normalizedOptions.find((opt) => String(opt.value) === String(value)),
    [normalizedOptions, value]
  )

  useEffect(() => {
    function handleOutsideClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  function chooseValue(nextValue) {
    const syntheticEvent = { target: { value: nextValue, name } }
    if (onChange) onChange(syntheticEvent)
    if (onValueChange) onValueChange(nextValue)
    setOpen(false)
  }

  return (
    <div ref={rootRef}>
      {label && <label className="block text-sm mb-1 text-slate-700">{label}</label>}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`w-full px-4 py-2 border rounded-lg bg-white text-left text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-eco-green/30 ${
            disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : "hover:border-eco-green"
          } ${className}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </button>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <ChevronDown size={18} />
        </div>

        {open && !disabled && (
          <ul
            className={`absolute z-40 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${menuClassName}`}
            role="listbox"
          >
            {normalizedOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-400">Tidak ada opsi</li>
            ) : (
              normalizedOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value)
                return (
                  <li key={String(opt.value)} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => chooseValue(opt.value)}
                      className={`w-full px-3 py-2 text-left text-sm transition ${
                        opt.disabled
                          ? "cursor-not-allowed text-slate-300"
                          : isSelected
                            ? "bg-mint-soft text-forest-emerald"
                            : "text-slate-700 hover:bg-mint-soft hover:text-forest-emerald"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
