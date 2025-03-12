"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CurrencyType = "EUR" | "USD" | "BTC"

interface CurrencyContextType {
  currency: CurrencyType
  setCurrency: (currency: CurrencyType) => void
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "EUR",
  setCurrency: () => {},
  formatCurrency: () => "",
})

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  // Récupérer la devise depuis localStorage au chargement
  const [currency, setCurrencyState] = useState<CurrencyType>("EUR")

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as CurrencyType
    if (savedCurrency && ["EUR", "USD", "BTC"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  // Mettre à jour localStorage quand la devise change
  const setCurrency = (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  // Fonction pour formater les montants selon la devise choisie
  const formatCurrency = (amount: number): string => {
    if (currency === "EUR") {
      return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
    } else if (currency === "USD") {
      return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
    } else if (currency === "BTC") {
      // Convertir en BTC (valeur approximative pour la démonstration)
      const btcValue = amount / 50000 // Taux de conversion approximatif
      return `₿${btcValue.toFixed(8)}`
    }
    return amount.toString()
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>{children}</CurrencyContext.Provider>
  )
}

