// Fonction pour récupérer les données de l'API CoinGecko
export async function fetchCryptoData(limit = 10) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
    )

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données")
    }

    const data = await response.json()
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      image: coin.image,
    }))
  } catch (error) {
    console.error("Erreur API:", error)
    return []
  }
}

// Fonction pour récupérer les données historiques d'une cryptomonnaie
export async function fetchCryptoHistory(coinId: string, days = 7) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=${days}`,
    )

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données historiques")
    }

    const data = await response.json()

    // Formater les données pour le graphique
    return data.prices.map((item: [number, number]) => ({
      date: new Date(item[0]).toLocaleDateString("fr-FR"),
      price: item[1],
    }))
  } catch (error) {
    console.error("Erreur API historique:", error)
    return []
  }
}

