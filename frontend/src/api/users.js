import authAPI from "./auth"

// Récupérer le profil de l'utilisateur
export const getUserProfile = async () => {
  try {
    const response = await authAPI.get("/users/profile")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération du profil" }
  }
}

// Mettre à jour le profil de l'utilisateur
export const updateUserProfile = async (userData) => {
  try {
    const response = await authAPI.put("/users/profile", userData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la mise à jour du profil" }
  }
}

// Changer le mot de passe
export const changePassword = async (passwordData) => {
  try {
    const response = await authAPI.put("/users/change-password", passwordData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors du changement de mot de passe" }
  }
}

// Supprimer le compte
export const deleteAccount = async (password) => {
  try {
    const response = await authAPI.delete("/users/account", { data: { password } })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression du compte" }
  }
}
