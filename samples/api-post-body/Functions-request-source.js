// No authentication. demonstrate POST with data in body
// call an open graphql api: https://api.spacex.land/graphql/

// make HTTP request
const url = "https://api.spacex.land/graphql/"
console.log(`HTTP POST Request to ${url}`)
const latestLaunchRequest = Functions.makeHttpRequest({
  url: url,
  method: "POST",
  data: {
    query:
      "{ \
        launchLatest \
        {     \
          id  \
          launch_date_utc \
          launch_success \
          launch_site \
          {     \
            site_name_long    \
          }   \
          mission_name  \
        } \
      }",
  },
})

// Execute the API request (Promise)
const latestLaunchResponse = await latestLaunchRequest
if (latestLaunchResponse.error) {
  console.error(latestLaunchResponse.error)
  throw Error("Request failed")
}

const launchLatest = latestLaunchResponse["data"]["data"]["launchLatest"]

console.log("latest launch response", launchLatest)

const result = {
  date: launchLatest.launch_date_utc,
  success: launchLatest.launch_success,
}

return Buffer.from(JSON.stringify(result))
