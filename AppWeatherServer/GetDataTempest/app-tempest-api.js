require('dotenv').config();
const logger = require('./../Shared/Configuration/logger');
const schedule = require('node-schedule');
const { tempestService } = require('../Shared/Service/tempest-service');
const { stationService } = require('./../Shared/Service/station-service');
const { socketService } = require('./../Shared/Service/socket-service');
const { utilFunctions } = require("./../Shared/Configuration/utils");
const StationInfo = require('./../Shared/Model/station-info');

console.log(process.env.WF_TOKEN);

(async () => {



    const job = schedule.scheduleJob('*/1 * * * *', async () => {
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
    });

    function ConvertToStationInfo(resultStation){
        return new StationInfo(null, resultStation.station_id, resultStation.obs[0].air_temperature, resultStation.obs[0].barometric_pressure, resultStation.obs[0].air_density, resultStation.obs[0].brightness, 
            resultStation.obs[0].relative_humidity, resultStation.obs[0].sea_level_pressure, resultStation.obs[0].solar_radiation, resultStation.obs[0].station_pressure, resultStation.obs[0].wind_direction, 
            resultStation.obs[0].wind_chill, resultStation.obs[0].timestamp);
    }
    
    async function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
    }
})();