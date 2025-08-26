"use client"
import React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MessageCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { login } from "../api/auth"

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
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
      await login(formData)
      navigate("/chat")
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setErrors({
        ...errors,
        api: error.message || "Email ou mot de passe incorrect",
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
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-0 overflow-hidden">
      <div className="relative h-screen w-full">
        <div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-br to-purple-900"
          style={{
            clipPath: "polygon(0 0, 0 100%, 100% 0)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              variants={bubble}
              animate="float"
              className="absolute left-[10%] top-[20%] h-3 w-3 rounded-full bg-white/20"
            ></motion.div>
            <motion.div
              variants={bubble}
              animate="float"
              className="absolute left-[20%] top-[4%] h-3 w-3 rounded-full bg-white/20"
            ></motion.div>
            <motion.div
              variants={bubble}
              animate="float"
              style={{ y: 5 }}
              className="absolute left-[30%] top-[50%] h-5 w-5 rounded-full bg-white/20"
            ></motion.div>
            <motion.div
              variants={bubble}
              animate="float"
              style={{ y: 5 }}
              className="absolute left-[40%] top-[6%] h-5 w-5 rounded-full bg-white/20"
            ></motion.div>
            <motion.div
              variants={bubble}
              animate="float"
              style={{ y: -5 }}
              className="absolute left-[68%] top-[30%] h-4 w-4 rounded-full bg-white/20"
            ></motion.div>
            <motion.div
              variants={bubble}
              animate="float"
              style={{ y: 7 }}
              className="absolute left-[10%] top-[70%] h-6 w-6 rounded-full bg-white/20"
            ></motion.div>
            <motion.div
              variants={bubble}
              animate="float"
              style={{ y: -3 }}
              className="absolute top-[60%] h-3 w-3 rounded-full bg-white/20"
            ></motion.div>
          </div>
        </div>

        <div className="relative h-full w-full flex flex-col md:flex-row">
          <div className="h-[30vh] md:h-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-start z-10">
            <div className="flex items-center">
              <Link to="/">
                <div className="text-white p-2 rounded-lg mr-2">
                  <MessageCircle size={25} />
                </div>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-white">ChatBot</h1>
            </div>

            <div className="mt-4 sm:mt-8 md:mt-16 lg:mt-24">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-white">
                Bienvenue à nouveau!
              </h2>
              <p className="text-purple-200 text-sm sm:text-base">Connectez-vous pour continuer votre expérience</p>
            </div>
          </div>

          <div className="h-[70vh] md:h-full md:w-1/2 flex items-start md:items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-xl">
              <div className="mb-4 sm:mb-6 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Connexion</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Entrez vos identifiants pour accéder à votre compte
                </p>
              </div>

              {errors.api && <div className="mb-4 rounded-md bg-red-500/20 p-3 text-sm text-red-200">{errors.api}</div>}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-base sm:text-lg font-medium text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Entrez votre email"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950 border ${
                        errors.email ? "border-red-500" : "border-purple-500/30"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-base sm:text-lg font-medium text-white">
                      Mot de passe
                    </label>
                   
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950 border ${
                        errors.password ? "border-red-500" : "border-purple-500/30"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-purple-700 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 font-medium text-base sm:text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Connexion en cours...
                    </span>
                  ) : (
                    "SE CONNECTER"
                  )}
                </button>
              </form>

              <div className="mt-4 sm:mt-6 text-center">
                <span className="text-white text-xs sm:text-sm">Vous n'avez pas de compte? </span>
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 hover:underline text-xs sm:text-sm">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
