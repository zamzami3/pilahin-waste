"use client"

import React from "react"
import { ChevronDown } from "lucide-react"

export default function StyledSelect({ label, value, onChange, options = [] }) {
  return (
    <div>
      {label && <label className="block text-sm mb-1 text-slate-700">{label}</label>}

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none w-full px-4 py-2 border rounded-lg bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-eco-green/30"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  )
}
