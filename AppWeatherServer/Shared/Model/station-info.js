const { utilFunctions } = require("./../Configuration/utils");

class StationInfo {

    constructor(id,station_id,air_temperature,barometric_pressure,air_density,brightness,relative_humidity,sea_level_pressure,solar_radiation,station_pressure,wind_direction,wind_chill,wind_avg,timestamp,local_date=null,type="general"){
        this.id = id;
        this.station_id = station_id;
        this.air_temperature = air_temperature;
        this.barometric_pressure = barometric_pressure;
        this.air_density = air_density;
        this.brightness = brightness;
        this.relative_humidity = relative_humidity;
        this.sea_level_pressure = sea_level_pressure;
        this.solar_radiation = solar_radiation;
        this.station_pressure = station_pressure;
        this.wind_direction = wind_direction;
        this.wind_chill = wind_chill;
        this.wind_avg = wind_avg;
        this.timestamp = timestamp;
        this.type = type;
        this.local_date = utilFunctions.convertTimestampToLocalDateTime(timestamp);
    }
}

module.exports = StationInfo;