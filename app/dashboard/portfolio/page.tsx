"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrency } from "@/context/currency-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface CryptoAsset {
  id: string
  name: string
  symbol: string
  amount: number
  price: number
  change24h: number
  value: number
  date: string
}

export default function Portfolio() {
  const { formatCurrency } = useCurrency()
  const [assets, setAssets] = useState<CryptoAsset[]>([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.5,
      price: 50000,
      change24h: 2.5,
      value: 25000,
      date: "2023-01-15",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      amount: 4.2,
      price: 3000,
      change24h: -1.2,
      value: 12600,
      date: "2023-02-20",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      amount: 1000,
      price: 0.5,
      change24h: 5.8,
      value: 500,
      date: "2023-03-10",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      amount: 25,
      price: 120,
      change24h: 8.3,
      value: 3000,
      date: "2023-04-05",
    },
  ])

  const [newAsset, setNewAsset] = useState({
    name: "",
    symbol: "",
    amount: "",
    price: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAsset({
      ...newAsset,
      [name]: value,
    })
  }

  const handleAddAsset = () => {
    const amount = Number.parseFloat(newAsset.amount)
    const price = Number.parseFloat(newAsset.price)

    if (newAsset.name && newAsset.symbol && amount && price) {
      const asset: CryptoAsset = {
        id: Date.now().toString(),
        name: newAsset.name,
        symbol: newAsset.symbol.toUpperCase(),
        amount,
        price,
        change24h: 0,
        value: amount * price,
        date: new Date().toISOString().split("T")[0],
      }

      setAssets([...assets, asset])
      setNewAsset({
        name: "",
        symbol: "",
        amount: "",
        price: "",
      })
    }
  }

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id))
  }

  const totalValue = assets.reduce((total, asset) => total + asset.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon portefeuille</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un actif
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-asset-description">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel actif</DialogTitle>
              <DialogDescription id="add-asset-description">
                Entrez les détails de votre nouvel investissement en cryptomonnaie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Bitcoin"
                    value={newAsset.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbole</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    placeholder="BTC"
                    value={newAsset.symbol}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Quantité</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="any"
                    placeholder="0.5"
                    value={newAsset.amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="any"
                    placeholder="50000"
                    value={newAsset.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAsset}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résumé du portefeuille</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{formatCurrency(totalValue)}</div>
          <div className="space-y-4">
            {assets.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Aucun actif dans votre portefeuille. Ajoutez votre premier actif !
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Actif</th>
                      <th className="text-right py-3 px-2">Prix</th>
                      <th className="text-right py-3 px-2">Quantité</th>
                      <th className="text-right py-3 px-2">Valeur</th>
                      <th className="text-right py-3 px-2">Date d'achat</th>
                      <th className="text-right py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id} className="border-b">
                        <td className="py-3 px-2">
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                        </td>
                        <td className="text-right py-3 px-2">{formatCurrency(asset.price)}</td>
                        <td className="text-right py-3 px-2">{asset.amount}</td>
                        <td className="text-right py-3 px-2 font-medium">{formatCurrency(asset.value)}</td>
                        <td className="text-right py-3 px-2">{asset.date}</td>
                        <td className="text-right py-3 px-2">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

