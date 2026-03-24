// Simple mock auth helper that stores users and current user in localStorage

const DEFAULT_USERS = [
  // Start empty: demo/sample credentials are managed in backend database.
]

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage
}

function _getStoredUsers() {
  if (!isBrowser()) return []
  const raw = localStorage.getItem('pilahin_users')
  if (!raw) {
    localStorage.setItem('pilahin_users', JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS.slice()
  }
  try {
    return JSON.parse(raw || '[]')
  } catch (e) {
    localStorage.setItem('pilahin_users', JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS.slice()
  }
}

function _saveUsers(users) {
  if (!isBrowser()) return
  localStorage.setItem('pilahin_users', JSON.stringify(users))
}

function getUsers() {
  return _getStoredUsers()
}

function ensureDefaults() {
  _getStoredUsers()
}

function saveCurrentUser(user) {
  if (!isBrowser()) return
  localStorage.setItem('pilahin_user', JSON.stringify(user))
}

function getCurrentUser() {
  if (!isBrowser()) return null
  const raw = localStorage.getItem('pilahin_user')
  try {
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function logout() {
  if (!isBrowser()) return
  localStorage.removeItem('pilahin_user')
}

function registerUser({ name, email, password, role }) {
  if (!isBrowser()) throw new Error('Registrasi hanya tersedia di client')
  if (role && role !== 'warga') {
    throw new Error('Registrasi hanya untuk role warga')
  }
  const users = _getStoredUsers()
  if (users.find((u) => u.email === email)) {
    throw new Error('Email sudah terdaftar')
  }
  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
  const newUser = { id, name, email, password, role: 'warga' }
  users.push(newUser)
  _saveUsers(users)
  saveCurrentUser(newUser)
  return newUser
}

function loginUser(email, password) {
  if (!isBrowser()) throw new Error('Login hanya tersedia di client')
  const users = _getStoredUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Email atau password salah')
  saveCurrentUser(user)
  return user
}

export { ensureDefaults, getUsers, getCurrentUser, loginUser, logout, registerUser, saveCurrentUser }
