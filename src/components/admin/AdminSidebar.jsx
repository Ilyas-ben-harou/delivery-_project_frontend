"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { BarChart3, Bell, Box, CircleDollarSign, LayoutDashboard, LogOut, Search, Settings, Truck, User, Users } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "../ui/sidebar"
import { AdminHeader } from "./Header"

export default function AdminSidebar({ children, onLogout }) {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  // Add state to control dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="border-r bg-white shadow-sm">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <Box className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-gray-800">Admin Panel</span>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/dashboard"}
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2">
                        <LayoutDashboard className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Tableau de bord</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/admin/livreurs" || location.pathname.startsWith("/admin/livreurs/")
                      }
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/livreurs" className="flex items-center gap-3 px-3 py-2">
                        <Users className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Distributeurs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/orders" || location.pathname.startsWith("/admin/orders/")}
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-2">
                        <Truck className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Livraisons</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/admin/clients" || location.pathname.startsWith("/admin/clients/")
                      }
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/clients" className="flex items-center gap-3 px-3 py-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Clients</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === "/admin/zones" || location.pathname.startsWith("/admin/zones/")
                      }
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/zones" className="flex items-center gap-3 px-3 py-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Zones</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="my-4" />

            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rapports
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/performance"}
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/performance" className="flex items-center gap-3 px-3 py-2">
                        <BarChart3 className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Performance</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/reports"}
                      className="hover:bg-gray-100 rounded-lg"
                    >
                      <Link to="/admin/financial" className="flex items-center gap-3 px-3 py-2">
                        <CircleDollarSign className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Finances</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-2 border-t">
            {/* Implement a simple dropdown without using the DropdownMenu component */}
            <div className="relative">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback className="bg-primary text-white">IL</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-gray-700">Ilyas</span>
                    <span className="text-xs text-gray-500">ilyas@gmail.com</span>
                  </div>
                </div>
              </Button>

              {/* Dropdown content */}
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                  <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">Mon compte</div>
                  <div className="py-1">
                    <Link
                      to="/admin/profile"
                      className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Profil</span>
                    </Link>
                    <button
                      className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setIsDropdownOpen(false)
                        // Add settings action here
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Paramètres</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false)
                        if (onLogout) onLogout()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm">
            <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
            <div className="flex-1" />
            <AdminHeader />
            <div></div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
