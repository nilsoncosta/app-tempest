const { utilFunctions } = require("./../Configuration/utils");

class SpeedWind {

    constructor(station_id,speed,direction,timestamp,local_date=null, type="wind"){
        this.station_id = station_id;
        this.wind_speed = speed;
        this.wind_direction = direction;
        this.type = type;
        this.local_date = utilFunctions.formatDateTime(timestamp);
    }
}

module.exports = SpeedWind;