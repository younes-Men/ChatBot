const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète_jwt"

// Middleware pour authentifier le token JWT
const authenticateToken = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." })
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    return res.status(403).json({ message: "Token invalide ou expiré" })
  }
}

module.exports = { authenticateToken }
