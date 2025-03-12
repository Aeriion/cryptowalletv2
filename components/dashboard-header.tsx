"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import MobileMenu from "./mobile-menu"

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error)
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu />
          <Link href="/dashboard" className="text-xl font-bold ml-2 md:ml-0">
            CryptoTracker
          </Link>
          <nav className="hidden md:flex ml-10 space-x-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Tableau de bord
            </Link>
            <Link href="/dashboard/portfolio" className="text-sm font-medium hover:text-primary">
              Mon portefeuille
            </Link>
            <Link href="/dashboard/market" className="text-sm font-medium hover:text-primary">
              Marché
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Menu utilisateur</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

