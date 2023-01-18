// This example shows how to make a decentralized price feed using multiple APIs

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const coinMarketCapCoinId = args[0]

if (
  !secrets.apiKey ||
  secrets.apiKey === "Your coinmarketcap API key (get a free one: https://coinmarketcap.com/api/)"
) {
  throw Error(
    "COINMARKETCAP_API_KEY environment variable not set for CoinMarketCap API.  Get a free key from https://coinmarketcap.com/api/"
  )
}

// To make an HTTP request, use the Functions.makeHttpRequest function
// Functions.makeHttpRequest function parameters:
// - url
// - method (optional, defaults to 'GET')
// - headers: headers supplied as an object (optional)
// - params: URL query parameters supplied as an object (optional)
// - data: request body supplied as an object (optional)
// - timeout: maximum request duration in ms (optional, defaults to 10000ms)
// - responseType: expected response type (optional, defaults to 'json')

// Use multiple APIs & aggregate the results to enhance decentralization
const coinMarketCapRequest = Functions.makeHttpRequest({
  url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&id=${coinMarketCapCoinId}`,
  // Get a free API key from https://coinmarketcap.com/api/
  headers: { "X-CMC_PRO_API_KEY": secrets.apiKey },
})

// First, execute all the API requests are executed concurrently, then wait for the responses
const coinMarketCapResponse = await coinMarketCapRequest

if (coinMarketCapResponse.error) {
  throw new Error("CoinMarketCap Error")
}
const price = coinMarketCapResponse.data.data[coinMarketCapCoinId].quote.USD.price

console.log(`Bitcoin price: $${price.toFixed(2)}`)

return Functions.encodeUint256(Math.round(price * 100))
