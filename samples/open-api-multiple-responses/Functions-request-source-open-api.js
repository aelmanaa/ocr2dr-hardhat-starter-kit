// This example shows how to make a call to an open API (no authentication required)
// to retrieve asset price from a symbol(e.g., ETH) to another symbol (e.g., USD)

// CryptoCompare API https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint

// Refer to https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const fromSymbol = args[0]
const toSymbol = args[1]

// make HTTP request
const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromSymbol}&tsyms=${toSymbol}`
console.log(`HTTP GET Request to ${url}`)
const cryptoCompareRequest = Functions.makeHttpRequest({
  url: url,
})

// Execute the API request (Promise)
const cryptoCompareResponse = await cryptoCompareRequest
if (cryptoCompareResponse.error) {
  console.error(cryptoCompareResponse.error)
  throw Error("Request failed")
}

const data = cryptoCompareResponse["data"]
if (data.Response === "Error") {
  console.error(data.Message)
  throw Error(`Functional error. Read message: ${data.Message}`)
}

const { PRICE: price, VOLUME24HOUR: volume, LASTMARKET: lastMarket } = data["RAW"][fromSymbol][toSymbol]
console.log(
  `${fromSymbol} price is: ${price.toFixed(2)} ${toSymbol}. 24h Volume is ${volume.toFixed(
    2
  )} ${toSymbol}. Market: ${lastMarket}`
)

const result = {
  price: Math.round(price * 100),
  volume: Math.round(volume * 100),
  lastMarket,
}
return Buffer.from(JSON.stringify(result))
