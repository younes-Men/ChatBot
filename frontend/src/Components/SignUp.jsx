"use client"
import React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MessageCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { register } from "../api/auth"

export default function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Effacer l'erreur lorsque l'utilisateur commence à taper
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validation du nom complet
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis"
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      await register(formData)
      navigate("/chat")
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      setErrors({
        ...errors,
        api: error.message || "Une erreur s'est produite lors de l'inscription",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const bubble = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-start p-4 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/2 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-bl from-purple-800/30 to-purple-600/30"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        ></div>
        <div
          className="absolute inset-0 bg-gradient-to-bl from-purple-700/40 to-purple-500/40"
          style={{
            clipPath: "polygon(100% 0, 100% 80%, 20% 100%)",
          }}
        ></div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-700 to-purple-500 rounded-full blur-3xl opacity-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-600 to-fuchsia-400 rounded-full blur-3xl opacity-20 z-0"></div>

      <div className="absolute top-6 left-6 flex items-center z-20">
        <Link to="/">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </Link>
        <span className="text-xl font-bold text-white">Chatbot</span>
      </div>

      {/* Particules décoratives */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 10 + 5
          const top = Math.random() * 100
          const left = Math.random() * 100
          const duration = Math.random() * 10 + 10
          const delay = Math.random() * 5
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-600 opacity-10"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-purple-500/20 relative z-10 backdrop-blur-sm mt-12 ml-16">
        <div className="py-5 px-6 relative z-10">
          <h2 className="text-center tracking-tight text-4xl font-bold text-white">Créer un compte</h2>
          <p className="text-center text-purple-200/80 text-sm mt-2">Rejoignez-nous pour commencer votre expérience</p>
        </div>

        <div className="p-8 relative z-10">
          {errors.api && <div className="mb-4 rounded-md bg-red-500/20 p-3 text-sm text-red-200">{errors.api}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom complet */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">Nom complet *</label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-950 border ${errors.fullName ? "border-red-500" : "border-purple-500/30"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-purple-200/50`}
                placeholder="Votre nom complet"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">Adresse email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-950 border ${errors.email ? "border-red-500" : "border-purple-500/30"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-purple-200/50`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">Mot de passe *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-950 border ${errors.password ? "border-red-500" : "border-purple-500/30"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-purple-200/50`}
                  placeholder="Minimum 6 caractères"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">Confirmer mot de passe *</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-950 border ${errors.confirmPassword ? "border-red-500" : "border-purple-500/30"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-purple-200/50`}
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-700 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Inscription en cours...
                </span>
              ) : (
                "S'INSCRIRE"
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-purple-100 text-sm">
              Vous avez déjà un compte?{" "}
              <Link
                to="/login"
                className="text-purple-300 hover:text-white font-medium hover:underline transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
