export type Weather = {
  temperature_2m: number;          // °C
  precipitation: number;            // mm last hour
  precipitation_probability?: number; // %
  cloud_cover: number;              // %
  wind_speed_10m: number;           // m/s
  snowfall?: number;                // cm last hour (Open-Meteo returns mm water eq. for precip; snowfall is often in cm)
  snow_depth?: number;              // cm
};

export type Marine = {
  wave_height?: number;             // m
  wave_period?: number;             // s
};

export type ActivityScore = { activity: string; score: number };