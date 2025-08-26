import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

// Configuration d'Axios
const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token aux requêtes
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Inscription
export const register = async (userData) => {
  try {
    const response = await authAPI.post("/auth/signup", userData)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)

      // S'assurer que l'utilisateur a un ID
      const user = response.data.user
      if (!user.id && user._id) {
        user.id = user._id
      }

      localStorage.setItem("user", JSON.stringify(user))
    }
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de l'inscription" }
  }
}

// Connexion
export const login = async (credentials) => {
  try {
    const response = await authAPI.post("/auth/login", credentials)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)

      // S'assurer que l'utilisateur a un ID
      const user = response.data.user
      if (!user.id && user._id) {
        user.id = user._id
      }

      localStorage.setItem("user", JSON.stringify(user))
    }
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la connexion" }
  }
}

// Déconnexion
export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = localStorage.getItem("token")
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error)
    logout() // Déconnexion en cas d'erreur
    return false
  }
}

// Récupérer l'utilisateur courant
export const getCurrentUser = () => {
  const user = localStorage.getItem("user")
  if (!user) return null

  try {
    const userData = JSON.parse(user)
    // S'assurer que l'ID de l'utilisateur est disponible
    if (!userData.id && userData._id) {
      userData.id = userData._id // Utiliser _id comme fallback si id n'existe pas
    }
    return userData
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return null
  }
}

// Vérifier la validité du token
export const verifyToken = async () => {
  try {
    const response = await authAPI.get("/auth/verify")
    return response.data
  } catch (error) {
    logout()
    throw error.response?.data || { message: "Token invalide" }
  }
}

export default authAPI
