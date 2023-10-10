const { myConnection } = require("../Configuration/mysql-connection")
const { utilFunctions } = require("./../Configuration/utils");

const stationService = {
    
    checkToken: async function (token){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, user_id FROM tokens WHERE token = ? AND expiration >  CONVERT_TZ(NOW(),'+00:00',@@global.time_zone);";
            myConnection.query(sql, [token],
                function(err, rows){
                    console.log(rows);
                    if(err) throw reject(err);
                    if (rows.length > 0) resolve(true);
                    resolve(false);
                }            
            );
        });
    },
 
    insertStationInfo: async function (info){
        const strDate = utilFunctions.convertTimestampToLocalDateTime(info.obs[0].timestamp);

        const sql = 'INSERT INTO station_info(station_id, local_date, air_temperature, barometric_pressure, air_density ,brightness ,relative_humidity, sea_level_pressure, solar_radiation, station_pressure, wind_direction, wind_chill) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);';
        const values = [info.station_id, strDate, info.obs[0].air_temperature, info.obs[0].barometric_pressure, , info.obs[0].air_density, info.obs[0].brightness, info.obs[0].relative_humidity, 
                        info.obs[0].sea_level_pressure, info.obs[0].solar_radiation, info.obs[0].station_pressure, info.obs[0].wind_direction, info.obs[0].wind_chill];
        return await myConnection.query(sql, values);
    },


}

module.exports = {stationService}
