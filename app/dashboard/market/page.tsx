"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { useCurrency } from "@/context/currency-context"
import CryptoChart from "@/components/crypto-chart"
import { fetchCryptoData } from "@/lib/api"

interface CryptoCurrency {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  image?: string
}

export default function Market() {
  const { formatCurrency } = useCurrency()
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null)

  useEffect(() => {
    async function loadCryptoData() {
      try {
        setLoading(true)
        const data = await fetchCryptoData(15)
        setCryptos(data)
        if (data.length > 0) {
          setSelectedCrypto(data[0])
        }
      } catch (err) {
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCryptoData()
  }, [])

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">{error}</p>
        <p className="text-muted-foreground">Les données de démonstration sont affichées à la place.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Marché des cryptomonnaies</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher une cryptomonnaie..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedCrypto && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {selectedCrypto.image && (
                    <img
                      src={selectedCrypto.image || "/placeholder.svg"}
                      alt={selectedCrypto.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <CardTitle>
                    {selectedCrypto.name} ({selectedCrypto.symbol})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-3xl font-bold">{formatCurrency(selectedCrypto.price)}</p>
                    <div
                      className={`flex items-center ${selectedCrypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {selectedCrypto.change24h >= 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      <span>{selectedCrypto.change24h.toFixed(2)}% (24h)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Cap. marché</div>
                    <div className="font-medium">{formatCurrency(selectedCrypto.marketCap)}</div>
                  </div>
                </div>
                <CryptoChart coinId={selectedCrypto.id} />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top cryptomonnaies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCryptos.length > 0 ? (
                  filteredCryptos.map((crypto) => (
                    <div
                      key={crypto.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${selectedCrypto?.id === crypto.id ? "bg-accent" : ""}`}
                      onClick={() => setSelectedCrypto(crypto)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {crypto.image && (
                            <img
                              src={crypto.image || "/placeholder.svg"}
                              alt={crypto.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(crypto.price)}</div>
                          <div
                            className={`text-sm flex items-center justify-end ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {crypto.change24h >= 0 ? (
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="mr-1 h-3 w-3" />
                            )}
                            {crypto.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Aucune cryptomonnaie trouvée</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

