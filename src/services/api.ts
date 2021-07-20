interface CurrencyRate {
  currency: string;
  rate: string;
  timestamp: string;
}

export async function getRates(): Promise<CurrencyRate[]> {
  const data = await fetch(`https://api.nomics.com/v1/exchange-rates?key=${process.env.REACT_APP_API_KEY}`)
    .then(response => response.json());

  return data;
}

export async function getExchangeHistory(currency: string, start: Date, end: Date): Promise<ExchangeHistoryItem[]> {
  const data = await fetch(`https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_API_KEY}&currency=${currency}&start=${start.toISOString()}&end=${end.toISOString()}`)
    .then(response => response.json())

  return data;
}