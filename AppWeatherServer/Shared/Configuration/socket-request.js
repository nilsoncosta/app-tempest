const axios = require("axios")
const axiosRetry = require("axios-retry")

const { errorHandler } = require("./utils")

console.log('http://' + process.env.SOCKET_HOST + ":" + process.env.SOCKET_PORT);
const socketClient = axios.create({
  baseURL: 'http://localhost:9090',
})

socketClient.interceptors.response.use(undefined, (error) => {
  return errorHandler(error)
})

axiosRetry(socketClient, {
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

module.exports = { socketClient }