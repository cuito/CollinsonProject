export type Weather = {
    temperature_2m: number;
    precipitation: number;
    precipitation_probability?: number;
    cloud_cover: number;
    wind_speed_10m: number;
    snowfall?: number;
    snow_depth?: number;
};
export type Marine = {
    wave_height?: number;
    wave_period?: number;
};
export type ActivityScore = {
    activity: string;
    score: number;
};
