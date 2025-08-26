const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const path = require("path")

// Configuration
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète_jwt"

// Middleware
app.use(cors())
app.use(express.json())

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ChatBot")
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err))

// Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const chatRoutes = require("./routes/chats")
const messageRoutes = require("./routes/messages")

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/messages", messageRoutes)

// Route de test
app.get("/api/test", (req, res) => {
  res.json({ message: "API fonctionne correctement!" })
})

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"))
  })
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})
