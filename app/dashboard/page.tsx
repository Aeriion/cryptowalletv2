"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useCurrency } from "@/context/currency-context"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import CryptoChart from "@/components/crypto-chart"

interface CryptoAsset {
  id: string
  name: string
  symbol: string
  amount: number
  price: number
  change24h: number
  value: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const [portfolio, setPortfolio] = useState<CryptoAsset[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [change24h, setChange24h] = useState(0)
  const [loading, setLoading] = useState(true)

  // Données simulées pour la démo
  useEffect(() => {
    const mockPortfolio: CryptoAsset[] = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        amount: 0.5,
        price: 50000,
        change24h: 2.5,
        value: 25000,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        amount: 4.2,
        price: 3000,
        change24h: -1.2,
        value: 12600,
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        amount: 1000,
        price: 0.5,
        change24h: 5.8,
        value: 500,
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        amount: 25,
        price: 120,
        change24h: 8.3,
        value: 3000,
      },
    ]

    setPortfolio(mockPortfolio)
    const total = mockPortfolio.reduce((acc, asset) => acc + asset.value, 0)
    setTotalValue(total)

    // Calcul du changement moyen pondéré sur 24h
    const weightedChange = mockPortfolio.reduce((acc, asset) => {
      return acc + asset.change24h * (asset.value / total)
    }, 0)
    setChange24h(Number.parseFloat(weightedChange.toFixed(2)))

    setLoading(false)
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      <div className="portfolio-summary rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium opacity-80">Valeur totale</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium opacity-80">Évolution 24h</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold">{change24h}%</p>
              {change24h >= 0 ? (
                <ArrowUpRight className="ml-2 h-5 w-5 text-green-400" />
              ) : (
                <ArrowDownRight className="ml-2 h-5 w-5 text-red-400" />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium opacity-80">Nombre d'actifs</h3>
            <p className="text-3xl font-bold">{portfolio.length}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Mon portefeuille</TabsTrigger>
          <TabsTrigger value="market">Marché</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.map((asset) => (
              <Card key={asset.id} className="crypto-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{asset.name}</h3>
                      <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                    </div>
                    <div
                      className={`text-sm font-medium flex items-center ${asset.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {asset.change24h >= 0 ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {asset.change24h}%
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{formatCurrency(asset.price)}</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.amount} {asset.symbol} • {formatCurrency(asset.value)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du marché</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <CryptoChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

