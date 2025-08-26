const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète_jwt"
const JWT_EXPIRES_IN = "7d"

// Route d'inscription
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body

    // Validation des champs
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas" })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" })
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      fullName,
      email,
      password,
    })

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save()

    // Générer un token JWT
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" })
  }
})

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" })
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = Date.now()
    await user.save()

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    res.status(500).json({ message: "Erreur serveur lors de la connexion" })
  }
})

// Route pour vérifier le token
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    isValid: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
    },
  })
})

module.exports = router
