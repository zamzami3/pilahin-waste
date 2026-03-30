// Simple mock auth helper that stores users and current user in localStorage

const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Admin Utama',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    address: 'Kantor Pusat Pilahin',
  },
  {
    id: 2,
    name: 'Driver 1',
    email: 'driver@example.com',
    password: 'driver123',
    role: 'driver',
    address: 'Pool Armada Pilahin',
    status: 'on-route',
  },
  {
    id: 3,
    name: 'Warga 1',
    email: 'warga1@example.com',
    password: 'warga123',
    role: 'warga',
    address: 'Jl. Melati No. 10',
    points: 0,
    saldo_poin: 0,
  },
  {
    id: 4,
    name: 'Warga 2',
    email: 'warga2@example.com',
    password: 'warga456',
    role: 'warga',
    address: 'Jl. Cempaka No. 21',
    points: 0,
    saldo_poin: 0,
  },
  {
    id: 5,
    name: 'Warga 3',
    email: 'warga3@example.com',
    password: 'warga789',
    role: 'warga',
    address: 'Jl. Kenanga No. 7',
    points: 0,
    saldo_poin: 0,
  },
]

const LEGACY_SAMPLE_EMAILS = ['warga@example.com']

function migrateUsers(storedUsers) {
  const safeStored = Array.isArray(storedUsers) ? storedUsers : []
  const baselineEmails = new Set(DEFAULT_USERS.map((user) => user.email))
  const legacyEmails = new Set(LEGACY_SAMPLE_EMAILS)

  const filteredStored = safeStored.filter((user) => {
    const email = String(user?.email || '').toLowerCase()
    return email && !legacyEmails.has(email)
  })

  const mergedBaseline = DEFAULT_USERS.map((baseUser) => {
    const existing = filteredStored.find(
      (user) => String(user?.email || '').toLowerCase() === baseUser.email.toLowerCase()
    )

    if (!existing) return { ...baseUser }

    return {
      ...baseUser,
      ...existing,
      role: baseUser.role,
      email: baseUser.email,
      password: existing.password || baseUser.password,
      status: baseUser.role === 'driver' ? (existing.status || baseUser.status) : existing.status,
    }
  })

  const customUsers = filteredStored.filter(
    (user) => !baselineEmails.has(String(user?.email || '').toLowerCase())
  )

  const combined = [...mergedBaseline, ...customUsers]
  const usedIds = new Set()
  let nextId = 1

  return combined.map((user) => {
    const numericId = Number(user?.id)
    let id = Number.isInteger(numericId) && numericId > 0 ? numericId : null

    if (id === null || usedIds.has(id)) {
      while (usedIds.has(nextId)) nextId += 1
      id = nextId
      nextId += 1
    }

    usedIds.add(id)
    return { ...user, id }
  })
}

function syncCurrentUserWithUsers(users) {
  if (!isBrowser()) return
  const rawCurrent = localStorage.getItem('pilahin_user')
  if (!rawCurrent) return

  try {
    const current = JSON.parse(rawCurrent)
    const matched = users.find((user) => user.id === current?.id) || users.find((user) => user.email === current?.email)
    if (matched) {
      localStorage.setItem('pilahin_user', JSON.stringify(matched))
    }
  } catch (e) {
    // Ignore malformed current user state.
  }
}

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage
}

function _getStoredUsers() {
  if (!isBrowser()) return []
  const raw = localStorage.getItem('pilahin_users')
  if (!raw) {
    localStorage.setItem('pilahin_users', JSON.stringify(DEFAULT_USERS))
    syncCurrentUserWithUsers(DEFAULT_USERS)
    return DEFAULT_USERS.slice()
  }
  try {
    const parsed = JSON.parse(raw || '[]')
    const migrated = migrateUsers(parsed)
    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem('pilahin_users', JSON.stringify(migrated))
    }
    syncCurrentUserWithUsers(migrated)
    return migrated
  } catch (e) {
    localStorage.setItem('pilahin_users', JSON.stringify(DEFAULT_USERS))
    syncCurrentUserWithUsers(DEFAULT_USERS)
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
