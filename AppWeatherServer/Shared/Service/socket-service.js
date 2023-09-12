//const { socketClient } = require("../Configuration/socket-request")
const axios = require("axios")
const socketService = {

  sendStationInfo2: async function (data) {
    await axios.post("http://localhost:9090/updateInfo", data)
    .then((response) => {
      console.log(response);
    })
  },

}

module.exports = { socketService }