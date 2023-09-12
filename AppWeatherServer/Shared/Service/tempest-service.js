const { tempestClient } = require("../Configuration/tempest-request")

const tempestService = {

  getStationInfo: async function (station) {
    const response = await tempestClient.request({
      url: `/observations/station/${station}?token=${process.env.WF_TOKEN}`,
      method: "GET",
    })
    return response.data
  },

  getAllStations: async function () {
    const response = await tempestClient.request({
      url: `/stations?token=${process.env.WF_TOKEN}`,
      method: "GET",
    })
    return response.data
  },
}

module.exports = { tempestService }