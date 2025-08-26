const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")
const bcrypt = require("bcryptjs")

// Obtenir le profil de l'utilisateur connecté
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json(user)
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Mettre à jour le profil de l'utilisateur
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { fullName, email } = req.body

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } })
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" })
      }
    }

    // Mettre à jour les informations de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName: fullName || undefined,
        email: email || undefined,
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Changer le mot de passe
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation des champs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Tous les champs sont requis" })
    }

    // Trouver l'utilisateur
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" })
    }

    // Mettre à jour le mot de passe
    user.password = newPassword
    await user.save()

    res.json({ message: "Mot de passe changé avec succès" })
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Supprimer le compte utilisateur
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body

    // Validation du mot de passe
    if (!password) {
      return res.status(400).json({ message: "Mot de passe requis pour supprimer le compte" })
    }

    // Trouver l'utilisateur
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" })
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(req.user.userId)

    res.json({ message: "Compte supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router
