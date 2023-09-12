require('dotenv').config();
const logger = require('./../Shared/Configuration/logger');
const PORT = process.env.SOCKET_PORT || 2525;
const INDEX = "/public/index.html";
const express = require("express");
const { createServer } = require("http");
const bodyParser = require('body-parser');
const { stationService } = require('./../Shared/Service/station-service');

const app = express();
const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const { Server } = require("ws");
const wss = new Server({ server: httpServer });

app.post("/updateInfo", function (req, res, next) {
    console.log(req.body);
    broadcast(req.body);
  //res.send("updateInfo  OK");
});

app.get("/teste", function (req, res, next) {
    res.send("Teste  OK");
});
  
wss.on("connection", async (ws, req)  => {
  var index = req.url.indexOf('token=');
  if (index < 0){
        ws.send('{"Error" : "Token not found"');
        ws.close();
  } else {
    var token = req.url.substring(index + 6);
    const validToken = await stationService.checkToken(token);
    if (!validToken) {
        ws.send('{"Error" : "Invalid Token"');
        ws.close();
    }
    console.log("Client connected: " + token);
  }
  ws.on("close", () => console.log("Client disconnected"));
});


function broadcast(data) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(data));
    });
}
//4.) Boradcast updates
/*
setInterval(() => {
  wss.clients.forEach(client => {
    client.send(new Date().toTimeString());
  });
}, 1000);
*/
httpServer.listen(PORT, () => console.log("Servidor WebSocket iniciado: http://localhost:" + PORT));

/*
const express = require("express");
const {createServer} = require("http");
const {WebSocketServer} = require("ws");

const app = express();
//app.use(express.static("public"));
const server = createServer(app);

const wss = new WebSocketServer({ server });

var clients = new Array();
var port = process.env.SOCKET_PORT;

app.get('/update-station-info', function (req, res) {
    console.log(res.data);
    broadcast(res.data);
});

function serverStart() {
    console.log(`Servidor webSocket iniciado: ${process.env.SOCKET_HOST}:${port}`);
}

function handleClient(newClient, request) {
    console.log(request.url); 
    console.log("New Conexão!"); 

    clients.push(newClient); 

    function disconnectedClient() {
    var position = clients.indexOf(newClient);
    clients.splice(position, 1);
    console.log("Desconectado");
    }

    function clientResponse(data) {
    console.log(data.toString());
    //broadcast(data.toString());
    }


    newClient.on("message", clientResponse);
    newClient.on("close", disconnectedClient);
}

function broadcast(data) {
    for (let c in clients) {
        clients[c].send(data);
    }
}

server.listen(process.env.PORT || 3000, serverStart);
wss.on("connection", handleClient);
*/