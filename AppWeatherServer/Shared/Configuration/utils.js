
const errorHandler = (error) => {
   const statusCode = error.response?.status;

   if (statusCode && statusCode !== 401) {
     console.error(error);
   }

   return Promise.reject(error);
}

let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const utilFunctions = {

  currentTime: function() {
    const dt = new Date();
    return dt.toISOString().slice(0, 19).replace('T', ' ');
  },

  convertTimestampToLocalDateTime: function(datetime) {
    const dt = new Date(datetime * 1000);
    
    return dt.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo"
    });
    //return dt.toLocaleString("pt-BR");
  },

  formatDateTime: function(timestamp) {
    const dt = new Date(timestamp * 1000);
    let p = new Intl.DateTimeFormat('pt-BR',{
      year:'numeric',
      month:'2-digit',
      day:'2-digit',
      hour:'2-digit',
      minute:'2-digit',
      second: "2-digit",
      hour12: false
    }).formatToParts(dt).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    
    return `${p.month}/${p.day}/${p.year}, ${p.hour}:${p.minute}:${p.second}`; 
  },

  isFutureDate: function(dt) {
    const dtAux = new Date();
    const now = dtAux.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    });
    return dt > now;
  }

}
module.exports = { errorHandler, utilFunctions }