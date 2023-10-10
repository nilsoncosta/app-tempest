require('dotenv').config();
const logger = require('./../Shared/Configuration/logger');
const schedule = require('node-schedule');
const { tempestService } = require('../Shared/Service/tempest-service');
//const { stationService } = require('./../Shared/Service/station-service');
const { socketService } = require('./../Shared/Service/socket-service');
const { utilFunctions } = require("./../Shared/Configuration/utils");
const StationInfo = require('./../Shared/Model/station-info');
const SpeedWind = require('./../Shared/Model/speed-wind');

const WebSocket = require('ws');
 
var devices = new Map();
let info = null;

(async () => {
    const wsTempest = new WebSocket(`wss://ws.weatherflow.com/swd/data?token=${process.env.WF_TOKEN}`);
    wsTempest.on('open', () => {
        console.log("Conexão realizada com Tempest");

    });

      
    wsTempest.onmessage = (event) => {
        const obj = JSON.parse(event.data);
        console.log(event.data);
        try{
            switch (obj.type) {
                case "obs_st":
                    info = ConvertToStationInfo(obj);
                    socketService.sendStationInfo2(info);
                    console.log(info);
                    //stationService.insertStationInfo(resultStation);                    
                  break;
                case "rapid_wind":
                    info = ConvertToWindInfo(obj);
                    socketService.sendStationInfo2(info);
                    console.log(info);
                    break;
                default:
                  console.log("Message: " + event.data);
              }            
        } catch(err){
            console.log("Error: " + err);
        }

        //console.log("Add: " + event.data);
    }
     
    async function getInstaledDevices(){
        devices.clear();
        resultStations = await tempestService.getAllStations();
        if (resultStations != null && resultStations != undefined) {
            resultStations.stations.forEach(station => {
                station_device = station.station_items.forEach(deviceItem => {
                    if (deviceItem != null && deviceItem != undefined && deviceItem.item === "wind"){
                        devices.set(deviceItem.station_id, deviceItem.device_id);
                        console.log(devices);
                    }
                });                
            });
        }
    }

    async function setWebsocketConection(){
        console.log("Send Device: ", devices);
        devices.forEach(deviceItem => {
            console.log("Send Device: ", deviceItem);
            wsTempest.send(JSON.stringify({
                "type": "listen_start",
                "device_id": deviceItem,
                "id": Math.floor(Math.random() * 1000000000)
            }));

            wsTempest.send(JSON.stringify({
                "type": "listen_rapid_start",
                "device_id": deviceItem,
                "id": Math.floor(Math.random() * 1000000000)
            }));
        });
    };

    
    //const job = schedule.scheduleJob('*/1 * * * *', async () => {
/*
        try {
            const resultStation = await tempestService.getStationInfo("110519");
            let info = ConvertToStationInfo(resultStation);
            console.log(info);
            socketService.sendStationInfo2(info);
            stationService.insertStationInfo(resultStation);

            logger.info('Rotina executada em ' + utilFunctions.currentTime());
        } catch (exception) {
            logger.error(exception);
        }
        */
    //});

    function getKey(value) {
        return [...devices].find(([key, val]) => val == value)[0]
      }

    function ConvertToStationInfo(resultStation){
        console.log(resultStation);
        const station_id = getKey(resultStation.device_id);
        return new StationInfo(null, station_id, resultStation.obs[0][7], resultStation.obs[0][6], resultStation.summary.air_density, resultStation.obs[0][9], 
            resultStation.obs[0][8], resultStation.obs[0][6], resultStation.obs[0][11], resultStation.obs[0][6], resultStation.obs[0][4], 
            resultStation.obs[0][1],  resultStation.obs[0][2], resultStation.obs[0][0]);
        //return new StationInfo(null, station_id, resultStation.obs[0].air_temperature, resultStation.obs[0].barometric_pressure, resultStation.obs[0].air_density, resultStation.obs[0].brightness, 
        //    resultStation.obs[0].relative_humidity, resultStation.obs[0].sea_level_pressure, resultStation.obs[0].solar_radiation, resultStation.obs[0].station_pressure, resultStation.obs[0].wind_direction, 
        //    resultStation.obs[0].wind_chill,  resultStation.obs[0].wind_avg, resultStation.obs[0].timestamp);
    }

    function ConvertToWindInfo(resultwind){
        //const values = resultwind.ob.split(',');
        const station_id = getKey(resultwind.device_id);
        return new SpeedWind(station_id, resultwind.ob[1], resultwind.ob[2], resultwind.ob[0]);
    }

    async function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
    }

    await getInstaledDevices();
    await setWebsocketConection();

})();