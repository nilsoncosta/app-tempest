const jwt  = require("jsonwebtoken");

const utilToken = {

    decode: function(token) {
        try {
            return jwt.verify(token, process.env.JWT_KEY);
        } catch(err) {
            console.log(err);
            return undefined;
        }      
    },
  
    extractStation: function(datetime) {
      const dt = new Date(datetime * 1000);
      return dt.toLocaleString("pt-BR");
    },
  
  }
  module.exports = { utilToken }