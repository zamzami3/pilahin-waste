"use client"

import React from 'react'

export default class ClientErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    try {
      console.error('[ClientErrorBoundary]', error, info)
      if (typeof window !== 'undefined') {
        const payload = { message: error?.message, stack: error?.stack, info }
        try { localStorage.setItem('__pilahin_last_error', JSON.stringify(payload)) } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 max-w-4xl mx-auto text-red-700">
          <h2 className="text-lg font-semibold">Terjadi kesalahan pada halaman</h2>
          <div className="mt-3 text-sm whitespace-pre-wrap">{String(this.state.error?.message || 'Error tanpa pesan')}</div>
          <pre className="mt-3 text-xs text-slate-700">{this.state.error?.stack}</pre>
          <div className="mt-4">
            <button onClick={() => window.location.reload()} className="px-3 py-2 bg-eco-green text-white rounded">Muat Ulang</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
