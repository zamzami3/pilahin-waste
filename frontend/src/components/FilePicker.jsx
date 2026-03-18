"use client"

import React, { useRef, useState, useEffect } from "react"
import { UploadCloud } from "lucide-react"

export default function FilePicker({ label = "Foto Sampah (opsional)", accept = "image/*", onFileChange }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleClick = () => inputRef.current?.click()

  const handleChange = (e) => {
    const f = e.target.files && e.target.files[0]
    setFile(f)
    if (f) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
    if (onFileChange) onFileChange(e)
  }

  const clear = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    if (onFileChange) onFileChange({ target: { files: [] } })
  }

  return (
    <div>
      <label className="block text-sm mb-1 text-slate-700">{label}</label>

      <div className="border rounded-lg p-3 flex items-center gap-4 bg-white shadow-sm">
        <div className="w-28 h-20 bg-slate-50 rounded-md flex items-center justify-center overflow-hidden">
          {preview ? <img src={preview} alt="preview" className="object-cover w-full h-full" /> : <UploadCloud className="text-slate-300" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-700 truncate">{file ? file.name : "Tidak ada file dipilih"}</div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={handleClick} className="px-3 py-2 rounded-md bg-eco-green text-white text-sm">Pilih File</button>
            {file && <button type="button" onClick={clear} className="px-3 py-2 rounded-md border text-sm">Hapus</button>}
          </div>
        </div>

        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      </div>
    </div>
  )
}
