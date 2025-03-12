"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu principal">
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 h-full w-64 bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Fermer le menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">Navigation principale de l'application CryptoTracker</p>

            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block py-2 px-3 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Tableau de bord
              </Link>
              <Link
                href="/dashboard/portfolio"
                className="block py-2 px-3 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Mon portefeuille
              </Link>
              <Link
                href="/dashboard/market"
                className="block py-2 px-3 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Marché
              </Link>
              <Link
                href="/dashboard/settings"
                className="block py-2 px-3 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Paramètres
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

