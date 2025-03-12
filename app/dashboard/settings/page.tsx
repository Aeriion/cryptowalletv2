"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useCurrency } from "@/context/currency-context"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { user, logout } = useAuth()
  const { currency, setCurrency } = useCurrency()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    price: true,
    news: false,
    portfolio: true,
  })

  // Charger les préférences de notification depuis localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (e) {
        console.error("Erreur lors du chargement des préférences de notification", e)
      }
    }
  }, [])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler une mise à jour
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations de profil ont été mises à jour avec succès.",
      })
    }, 1000)
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler une mise à jour
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      })
    }, 1000)
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    }
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleCurrencyChange = (newCurrency: "EUR" | "USD" | "BTC") => {
    setCurrency(newCurrency)
  }

  const savePreferences = () => {
    toast({
      title: "Préférences enregistrées",
      description: `Devise définie sur ${currency === "EUR" ? "Euro" : currency === "USD" ? "Dollar US" : "Bitcoin"}`,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileUpdate}>
              <CardHeader>
                <CardTitle>Informations de profil</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">L'email ne peut pas être modifié</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Mise à jour..." : "Mettre à jour le profil"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <form onSubmit={handlePasswordUpdate}>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>Mettez à jour votre mot de passe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Gérez vos préférences d'affichage et de notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Devise</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={currency === "EUR" ? "default" : "outline"}
                    onClick={() => handleCurrencyChange("EUR")}
                  >
                    EUR (€)
                  </Button>
                  <Button
                    variant={currency === "USD" ? "default" : "outline"}
                    onClick={() => handleCurrencyChange("USD")}
                  >
                    USD ($)
                  </Button>
                  <Button
                    variant={currency === "BTC" ? "default" : "outline"}
                    onClick={() => handleCurrencyChange("BTC")}
                  >
                    BTC (₿)
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex-1">
                      Notifications par email
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange("email")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price-alerts" className="flex-1">
                      Alertes de prix
                    </Label>
                    <Switch
                      id="price-alerts"
                      checked={notifications.price}
                      onCheckedChange={() => handleNotificationChange("price")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="news-updates" className="flex-1">
                      Actualités et mises à jour
                    </Label>
                    <Switch
                      id="news-updates"
                      checked={notifications.news}
                      onCheckedChange={() => handleNotificationChange("news")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="portfolio-updates" className="flex-1">
                      Mises à jour du portefeuille
                    </Label>
                    <Switch
                      id="portfolio-updates"
                      checked={notifications.portfolio}
                      onCheckedChange={() => handleNotificationChange("portfolio")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences}>Enregistrer les préférences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

