require('dotenv').config();
const logger = require('./../Shared/Configuration/logger');
const PORT = process.env.SOCKET_PORT || 2525;
const INDEX = "/public/index.html";
const express = require("express");
const { createServer, http } = require("http");
const bodyParser = require('body-parser');
//const { stationService } = require('./../Shared/Service/station-service');
const fs = require('fs').promises;
const { utilToken } = require("./../Shared/Configuration/token-util");
const { utilFunctions } = require("./../Shared/Configuration/utils");
const SpeedWind = require('./../Shared/Model/speed-wind');
const ClientStation = require('./../Shared/Model/station-client');

const app = express();
const httpServer = createServer(app);

var clientStations = new Map();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const { Server } = require("ws");
const wss = new Server({ server: httpServer });

app.post("/updateInfo", function (req, res, next) {
    const json = req.body;
    //console.log("Inicial: " + json.station_id );
    let str = "";
    try{
        if (json.station_id !== null && json.station_id !== undefined) {
            let clientStation = clientStations.get(json.station_id);
            if (clientStation !== null && clientStation !== undefined){
                clientStation.sendMessage(req.body);
                console.log("Enviou: " + json.station_id + " - " + clientStation.station_id);
            } else {
                clientStation = new ClientStation(json.station_id, str);
                console.log(clientStation);
                clientStations.set(json.station_id, clientStation)
                clientStation.sendMessage(req.body);
            }
        }
    } catch (err) {
        console.log(err);
    }
    //broadcast(req.body);
    //res.send("updateInfo  OK");
    //console.log("Final: " + json.station_id );
    //console.log(clientStations);
});

app.get("/teste", function (req, res, next) {
    fs.readFile(__dirname + "/ws.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
});
  
wss.on("connection", async (ws, req)  => {
  var index = req.url.indexOf('token=');
  if (index < 0){
        ws.send('{"Error" : "Token not found"');
        ws.close();
  } else {
    let validToken = false;
    const queryParams = req.url.split('&'); 
    const token = queryParams[0].substring(index + 6);
    let stationId =  parseInt(queryParams[1].substring(11)); 
    const resultToken = utilToken.decode(token);
    if (resultToken != undefined){
        try{
            let exprationDate = utilFunctions.convertTimestampToLocalDateTime(resultToken.exp);
            if (utilFunctions.isFutureDate(exprationDate)){
                let clientStation = clientStations.get(stationId);
                //console.log(stationId);
                //console.log(clientStation);
                if (clientStation !== null && clientStation !== undefined){
                    //console.log("Achou");
                    clientStation.addClient(ws);
                    //console.log("Add: " + clientStation);
                } else {
                    //console.log("Não Achou");
                    clientStation = new ClientStation(stationId, "");
                    clientStations.set(stationId, clientStation)
                    clientStation.addClient(ws);
                    //console.log("Add: " + clientStation);
                }
                validToken = true;
            }
        } catch(err) {
            console.log(err);
        }
    }
    if (!validToken) {
        ws.send('{"Error" : "Invalid Token"');
        ws.close();
    } else {
        ws.isAlive = true;
    }
    console.log("Client connected");
  }
  ws.on("close", () => console.log("Client disconnected"));
});

/*
function broadcast(data) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(data));
    });
}
//4.) Boradcast updates

setInterval(() => {
  wss.clients.forEach(client => {
    client.send(new Date().toTimeString());
  });
}, 1000);
*/
httpServer.listen(PORT, () => console.log("Servidor WebSocket iniciado: http://localhost:" + PORT));
