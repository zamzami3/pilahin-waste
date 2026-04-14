import { apiClient, clearSession, getStoredUser, saveSession } from "./apiClient"

function goToRoleHome(role) {
  if (role === "warga") return "/warga"
  if (role === "driver") return "/driver/tasks"
  if (role === "admin") return "/admin"
  return "/"
}

async function login(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password })
  saveSession(data?.token, data?.user)
  return data
}

async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload)
  return data
}

async function fetchMe() {
  const { data } = await apiClient.get("/auth/me")
  const user = data?.user || null
  if (user) {
    saveSession(null, user)
  }
  return getStoredUser()
}

function getCurrentUser() {
  return getStoredUser()
}

function logout() {
  clearSession()
}

export { fetchMe, getCurrentUser, goToRoleHome, login, logout, register }
