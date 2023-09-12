const errorHandler = (error) => {
   const statusCode = error.response?.status;

   if (statusCode && statusCode !== 401) {
     console.error(error);
   }

   return Promise.reject(error);
}


const utilFunctions = {

  currentTime: function() {
    const dt = new Date();
    return dt.toISOString().slice(0, 19).replace('T', ' ');
  },

  convertTimestampToLocalDateTime: function(datetime) {
    const dt = new Date(datetime * 1000);
    return dt.toLocaleString("pt-BR");
  },
}
module.exports = { errorHandler, utilFunctions }