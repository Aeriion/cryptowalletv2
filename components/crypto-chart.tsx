"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetchCryptoHistory } from "@/lib/api"

interface ChartData {
  date: string
  price: number
}

interface CryptoChartProps {
  coinId?: string
}

export default function CryptoChart({ coinId = "bitcoin" }: CryptoChartProps) {
  const [timeframe, setTimeframe] = useState("7d")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadChartData() {
      try {
        setLoading(true)
        let days = 7

        if (timeframe === "1d") days = 1
        else if (timeframe === "7d") days = 7
        else if (timeframe === "30d") days = 30
        else if (timeframe === "1y") days = 365

        const data = await fetchCryptoHistory(coinId, days)
        setChartData(data)
      } catch (err) {
        setError("Impossible de charger les données du graphique")
        console.error(err)

        // Données de secours en cas d'erreur
        generateFallbackData(timeframe)
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [timeframe, coinId])

  // Fonction pour générer des données de secours en cas d'erreur API
  const generateFallbackData = (timeframe: string) => {
    const data: ChartData[] = []
    let days = 7

    if (timeframe === "1d") days = 1
    else if (timeframe === "7d") days = 7
    else if (timeframe === "30d") days = 30
    else if (timeframe === "1y") days = 365

    let price = 50000

    for (let i = 0; i < days; i++) {
      const change = Math.random() * 5 - 2
      price = price * (1 + change / 100)

      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
        price: price,
      })
    }

    setChartData(data)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">{coinId.charAt(0).toUpperCase() + coinId.slice(1)}</h3>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1d">1J</TabsTrigger>
              <TabsTrigger value="7d">7J</TabsTrigger>
              <TabsTrigger value="30d">30J</TabsTrigger>
              <TabsTrigger value="1y">1A</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive">{error}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    // Afficher moins de dates sur les petits écrans
                    if (timeframe === "30d" || timeframe === "1y") {
                      return ""
                    }
                    return value
                  }}
                />
                <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [
                    `€${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}`,
                    "Prix",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

