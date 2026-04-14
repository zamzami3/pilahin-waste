import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
const TOKEN_KEY = "pilahin_token"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

function extractApiError(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage ||
    "Terjadi kesalahan pada server"
  )
}

function saveSession(token, user) {
  if (typeof window === "undefined") return
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
  if (user) {
    const normalizedUser = {
      ...user,
      name: user.name || user.nama,
      phone: user.phone || user.no_wa,
      whatsapp: user.whatsapp || user.no_wa,
      address: user.address || user.alamat,
      points: Number(user.points ?? user.saldo_poin ?? 0),
    }
    localStorage.setItem("pilahin_user", JSON.stringify(normalizedUser))
  }
}

function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem("pilahin_user")
}

function getStoredUser() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("pilahin_user")
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

function getStoredToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export {
  apiClient,
  clearSession,
  extractApiError,
  getStoredToken,
  getStoredUser,
  saveSession,
}
