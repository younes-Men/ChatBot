import { jwtDecode } from "jwt-decode"

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

export const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    return decoded.exp > currentTime
  } catch (error) {
    console.error("Invalid token:", error)
    removeToken()
    return false
  }
}

export const getUser = () => {
  const token = getToken()
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return {
      id: decoded.userId,
      email: decoded.email,
      fullName: "", // This will be fetched from the API
    }
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // If unauthorized, clear token
  if (response.status === 401) {
    removeToken()
  }

  return response
}
