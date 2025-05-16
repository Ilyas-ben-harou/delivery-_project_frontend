"use client"

import { useState } from "react"
import { Menu, X, User, MapPin, Package, Truck, Bell } from "lucide-react"
import { Link } from "react-router"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck size={28} className="text-yellow-300" />
            <a href="/" className="text-2xl font-bold">
              SpeedShip
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="Home" className="font-medium hover:text-yellow-300 transition-colors">
              Home
            </a>
            <a href="Services" className="font-medium hover:text-yellow-300 transition-colors">
              Services
            </a>
            <a href="Pricing" className="font-medium hover:text-yellow-300 transition-colors">
              Pricing
            </a>
            <a href="About Us" className="font-medium hover:text-yellow-300 transition-colors">
              About Us
            </a>
            <a href="Contact" className="font-medium hover:text-yellow-300 transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Action Items */}
          <div className="hidden md:flex items-center space-x-5">
            <a href="#" className="flex items-center space-x-1 hover:text-yellow-300 transition-colors">
              <Package size={20} />
              <span>Track Order</span>
            </a>
            <a href="#" className="relative hover:text-yellow-300 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </a>
            <Link to="/login" className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-400 text-blue-900 py-2 px-4 rounded-lg transition-colors">
              <User size={18} />
              <span className="font-medium">Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-3 border-t border-blue-500 pt-3">
            <a href="#" className="block hover:text-yellow-300 transition-colors">
              Home
            </a>
            <a href="#" className="block hover:text-yellow-300 transition-colors">
              Services
            </a>
            <a href="#" className="block hover:text-yellow-300 transition-colors">
              Pricing
            </a>
            <a href="#" className="block hover:text-yellow-300 transition-colors">
              About Us
            </a>
            <a href="#" className="block hover:text-yellow-300 transition-colors">
              Contact
            </a>
            <div className="flex flex-col space-y-3 pt-2 border-t border-blue-500 mt-2">
              <a href="#" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
                <Package size={20} />
                <span>Track Order</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
                <Bell size={20} />
                <span>Notifications</span>
                <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </a>
              <a href="#" className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 py-2 px-4 rounded-lg transition-colors w-full">
                <User size={18} />
                <span className="font-medium">Login / Register</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}