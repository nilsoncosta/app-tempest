require('dotenv').config();
const logger = require('./../Shared/Configuration/logger');
const schedule = require('node-schedule');
const { tempestService } = require('../Shared/Service/tempest-service');
const { stationService } = require('./../Shared/Service/station-service');
const { socketService } = require('./../Shared/Service/socket-service');
const { utilFunctions } = require("./../Shared/Configuration/utils");
const StationInfo = require('./../Shared/Model/station-info');
const SpeedWind = require('./../Shared/Model/speed-wind');

const WebSocket = require('ws');
 
var devices = new Map();
let info = null;

(async () => {
    await getInstaledDevices();
    /*
    const wsTempest = new WebSocket(`wss://ws.weatherflow.com/swd/data?token=${process.env.WF_TOKEN}`);
    wsTempest.on('open', () => {
        console.log("Conexão realizada com Tempest");
        setWebsocketConection();
        //setWebsocketConection();
    });

    wsTempest.onerror = function(error) {
        console.log(`[error]`);
      };
      
    wsTempest.onmessage = (event) => {
        const obj = JSON.parse(event.data);
        console.log(event.data);
        try{
            switch (obj.type) {
                case "obs_st":
                    info = ConvertToStationInfo(obj);
                    //socketService.sendStationInfo2(info);
                    //console.log(info);
                    //stationService.insertStationInfo(resultStation);                    
                  break;
                case "rapid_wind":
                    info = ConvertToWindInfo(obj);
                    //socketService.sendStationInfo2(info);
                    //console.log(info);
                    break;
                default:
                  //console.log("Message: " + event.data);
              }            
        } catch(err){
            console.log("Error: " + err);
        }

    }
*/
    async function setWebsocketConection(){
        console.log("Send Device: ", devices);
        devices.forEach(deviceItem => {
            console.log("Send Stop: ", deviceItem);
            wsTempest.send(JSON.stringify({
                "type": "listen_stop",
                "device_id": deviceItem
            }));
            
            console.log("Send device Rapid Wind: ", deviceItem);
            wsTempest.send(JSON.stringify({
                "type": "listen_rapid_start",
                "device_id": deviceItem,
                "id": Math.floor(Math.random() * 1000000000)
            }));
            
            console.log("Send Device default: ", deviceItem);
            wsTempest.send(JSON.stringify({
                "type": "listen_start",
                "device_id": deviceItem,
                "id": Math.floor(Math.random() * 1000000000)
            }));
        });
    };

    async function getInstaledDevices(){
        devices.clear();
        devices.set(110516, 1110332);
        devices.set(110517, 1110333);
        devices.set(110518, 1110334);
        devices.set(110519, 279089);
    }

    //*    *    *    *    *    *
    //s    m    h    d    m    dia da semana (0-7)
    const job = schedule.scheduleJob('*/3 * * * * *', async () => {

        try {
            var time = "";
            var temp = '';
            var wind = '';
            var direction = '';
            var device = '';
            //var message = `{"device_id":${device},"serial_number":"ST-00106477","type":"rapid_wind","hub_sn":"HB-00119805","ob":[${time},${wind},${direction}]}`;
            devices.forEach(deviceItem => {
                device = deviceItem;
                time = Math.floor(Date.now() / 1000);
                temp = getRandomFloat(10.0, 28.2, 1);
                wind = getRandomFloat(2.0, 8.8, 1);
                direction = getRandomFloat(30.0, 76.8, 1);
                var message = '{"device_id":' + deviceItem + ',"serial_number":"ST-00106477","type":"rapid_wind","hub_sn":"HB-00119805","ob":[' + time + ',' + wind + ',' + direction + ']}';
            //const resultStation = await tempestService.getStationInfo("110519");
                let info = ConvertToWindInfo(JSON.parse(message));
                console.log(info);
                socketService.sendStationInfo2(info);
            });
            //const resultStation = await tempestService.getStationInfo("110519");
            //let info = ConvertToStationInfo(resultStation);
            //console.log(info);
            //socketService.sendStationInfo2(info);
            //stationService.insertStationInfo(resultStation);

            logger.info('Rotina executada 3s ' + utilFunctions.currentTime());
        } catch (exception) {
            logger.error(exception);
        }
        
    });

    function getRandomFloat(min, max, decimals) {
        const str = (Math.random() * (max - min) + min).toFixed(
          decimals,
        );
      
        return parseFloat(str);
      }

    const job2 = schedule.scheduleJob('*/1 * * * *', async () => {

        try {
            var time = "";
            var temp = '';
            var wind = '';
            var direction = '';
            var device = '';
            //var message = `{"device_id":${device},"type":"obs_st","obs":[[${time},3.16,${wind},4.23,${direction},3.0,1008.4,${temp},89.0,25652.0,1.72,214.0,0.0,0.0,0.0,0.0,2.57,1.0,0.0,null,null,0.0]],"summary":{"pressure_trend":"falling","strike_count_1h":1,"strike_count_3h":1,"precip_total_1h":0.0,"strike_last_dist":17,"strike_last_epoch":1695738552,"precip_accum_local_yesterday":3.433652,"precip_analysis_type_yesterday":0,"feels_like":20.7,"heat_index":20.7,"wind_chill":20.7,"dew_point":18.8,"wet_bulb_temperature":19.4,"wet_bulb_globe_temperature":20.2,"air_density":1.19547,"delta_t":1.3,"precip_minutes_local_day":0,"precip_minutes_local_yesterday":66},"source":"mqtt","serial_number":"ST-00106477","hub_sn":"HB-00119805","firmware_revision":172}`;
            devices.forEach(deviceItem => {
                device = deviceItem;
                time = Math.floor(Date.now() / 1000);
                temp = getRandomFloat(10.0, 28.2, 1);
                wind = getRandomFloat(2.0, 8.8, 1);
                direction = getRandomFloat(30.0, 76.8, 1);
                var message = '{"device_id":' + deviceItem + ',"type":"obs_st","obs":[[' + time + ',3.16,' + wind + ',4.23,' + direction + ',3.0,1008.4,' + temp + ',89.0,25652.0,1.72,214.0,0.0,0.0,0.0,0.0,2.57,1.0,0.0,null,null,0.0]],"summary":{"pressure_trend":"falling","strike_count_1h":1,"strike_count_3h":1,"precip_total_1h":0.0,"strike_last_dist":17,"strike_last_epoch":1695738552,"precip_accum_local_yesterday":3.433652,"precip_analysis_type_yesterday":0,"feels_like":20.7,"heat_index":20.7,"wind_chill":20.7,"dew_point":18.8,"wet_bulb_temperature":19.4,"wet_bulb_globe_temperature":20.2,"air_density":1.19547,"delta_t":1.3,"precip_minutes_local_day":0,"precip_minutes_local_yesterday":66},"source":"mqtt","serial_number":"ST-00106477","hub_sn":"HB-00119805","firmware_revision":172}';
                let info = ConvertToStationInfo(JSON.parse(message));
                console.log(info);
                socketService.sendStationInfo2(info);
            });
            //const resultStation = await tempestService.getStationInfo("110519");
            //let info = ConvertToStationInfo(resultStation);
            //console.log(message);
            //stationService.insertStationInfo(resultStation);

            logger.info('Rotina executada 1 min ' + utilFunctions.currentTime());
        } catch (exception) {
            logger.error(exception);
        }
        
    });

    function getKey(value) {
        return [...devices].find(([key, val]) => val == value)[0]
      }

    function ConvertToStationInfo(resultStation){
        //console.log(resultStation);
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

})();