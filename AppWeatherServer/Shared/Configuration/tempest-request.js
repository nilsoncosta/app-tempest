const axios = require("axios")
const axiosRetry = require("axios-retry")

const { errorHandler } = require("./utils")

console.log(process.env.EXTERNAL_API_URL);
const tempestClient = axios.create({
  baseURL: process.env.EXTERNAL_API_URL,
})

tempestClient.interceptors.response.use(undefined, (error) => {
  return errorHandler(error)
})

axiosRetry(tempestClient, {
  retries: 3, 
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`)
    return 1000
  },
  retryCondition: (error) => {
    console.log(error)
    return error.response.status === 503
  },
})

module.exports = { tempestClient }