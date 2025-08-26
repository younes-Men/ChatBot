"use client"
import React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { isAuthenticated, getCurrentUser, logout, verifyToken } from "../api/auth"

// Créer le contexte d'authentification
const AuthContext = createContext()

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext)

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser()

          // Vérifier la validité du token
          try {
            await verifyToken()
            setUser(currentUser)
          } catch (error) {
            console.error("Token invalide:", error)
            handleLogout()
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const handleLogin = (userData) => {
    setUser(userData)
  }

  // Fonction de déconnexion
  const handleLogout = () => {
    logout()
    setUser(null)
  }

  // Fonction de mise à jour du profil utilisateur
  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }))
  }

  // Valeur du contexte
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
