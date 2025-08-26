"use client"
import React from "react"
import { Menu, Mic } from "lucide-react"
import { Link } from "react-router-dom"

export function ChatHeader({ toggleSidebar, title }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4">
      <button
        onClick={toggleSidebar}
        className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-medium text-gray-200 flex-1 text-center">{title}</h1>
      <Link
        to="/voice-chat"
        className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
        title="Mode vocal"
      >
        <Mic className="h-5 w-5" />
      </Link>
    </header>
  )
}
