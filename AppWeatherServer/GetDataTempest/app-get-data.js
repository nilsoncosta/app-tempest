const WebSocket = require('ws');
const wsTempest = new WebSocket("wss://stream.binance.com:9443/ws/btcbusd@bookTicker");
 
wsTempest.on('open', () => {
    wsTempest.send(JSON.stringify({
   "method": "SUBSCRIBE",
   "params": [`${symbol.toLowerCase()}@bookTicker`],
   "id": 1
   }))
})
 
wsTempest.onmessage = (event) => {
   process.stdout.write('\033c');
   const obj = JSON.parse(event.data);
   console.log(`Symbol: ${obj.s}`);
   console.log(`Best ask: ${obj.a}`);
   console.log(`Best bid: ${obj.b}`);
}

