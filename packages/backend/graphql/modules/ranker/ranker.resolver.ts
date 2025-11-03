import type { Weather, Marine, ActivityScore } from "@collinson/types";

const rankerResolvers = {
  Query: {
    // ✅ accept args and pass them through
    rank: (_: unknown, args: { latitude: number; longitude: number }) =>
      getRankings(args.latitude, args.longitude),
  },
};

async function getOpenMeteo(lat: number, lon: number) {
  // Feel free to add &forecast_days=7 (forecast API supports it)
  const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,precipitation_probability,cloud_cover,wind_speed_10m,snowfall,snow_depth&timezone=auto`;
  const seaUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_period&timezone=auto`;

  const [wxRes, seaRes] = await Promise.all([fetch(wxUrl), fetch(seaUrl)]);
  const [wxJson, seaJson] = await Promise.all([wxRes.json(), seaRes.json()]);

  const now = new Date();                           // local (timezone=auto)
  const end = new Date(now.getTime() + 7 * 24 * 3600 * 1000); // +7 days

  // Average helper over [now, now+7d)
  const avgOverWeek = (times: string[] | undefined, values: number[] | undefined) => {
    if (!times || !values || !times.length || !values.length) return 0;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < times.length; i++) {
      const t = new Date(times[i]);
      if (t >= now && t < end) {
        const v = values[i];
        if (typeof v === "number" && !Number.isNaN(v)) {
          sum += v;
          count++;
        }
      }
    }
    return count ? sum / count : 0;
  };

  const wxTimes = wxJson.hourly?.time as string[] | undefined;
  const seaTimes = seaJson.hourly?.time as string[] | undefined;

  const wx = {
    temperature_2m: avgOverWeek(wxTimes, wxJson.hourly?.temperature_2m),
    precipitation: avgOverWeek(wxTimes, wxJson.hourly?.precipitation), // mean mm/hr over week
    precipitation_probability: avgOverWeek(wxTimes, wxJson.hourly?.precipitation_probability),
    cloud_cover: avgOverWeek(wxTimes, wxJson.hourly?.cloud_cover),
    wind_speed_10m: avgOverWeek(wxTimes, wxJson.hourly?.wind_speed_10m),
    snowfall: avgOverWeek(wxTimes, wxJson.hourly?.snowfall),
    snow_depth: avgOverWeek(wxTimes, wxJson.hourly?.snow_depth),
  };

  const sea = {
    wave_height: avgOverWeek(seaTimes, seaJson.hourly?.wave_height),
    wave_period: avgOverWeek(seaTimes, seaJson.hourly?.wave_period),
  };

  return { wx, sea };
}

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

// Normalizers (0..1 helpers)
const smoothStep = (x: number, a: number, b: number) =>
  x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a);

function rankActivities(wx: Weather, sea: Marine = {}): ActivityScore[] {
  const {
    temperature_2m: T,
    precipitation: P,
    precipitation_probability: Pp = undefined,
    cloud_cover: CC,
    wind_speed_10m: W,
    snowfall = 0,
    snow_depth = 0,
  } = wx;
  const { wave_height = 0, wave_period = 0 } = sea;

  // ---- Skiing score (0..100)
  // Cold better (≤0°C good, >2°C hurts), fresh snow & depth good, high wind hurts (>10 m/s)
  const cold = 1 - smoothStep(T, 0, 2);                 // 1 when <=0°C, trends to 0 by 2°C
  const freshSnow = clamp(snowfall / 5, 0, 1);          // 5 cm/hr ≈ max bonus
  const baseDepth = clamp(snow_depth / 50, 0, 1);       // 50 cm depth ≈ solid cover
  const windPenaltySki = 1 - clamp((W - 6) / 10, 0, 1); // >6 m/s starts to hurt
  const rainPenaltySki = 1 - clamp(P / 2, 0, 1);        // rain mm/hr
  const skiing = 100 * (
    0.35 * cold +
    0.30 * freshSnow +
    0.20 * baseDepth +
    0.10 * windPenaltySki +
    0.05 * rainPenaltySki
  );

  // ---- Surfing score (0..100)
  // Sweet spot waves ~0.8–3m (too small/huge less ideal), longer period 8–16s, lower wind better
  const waveSize = clamp((wave_height - 0.5) / (3 - 0.5), 0, 1); // 0.5m→3m
  const periodQuality = clamp((wave_period - 8) / (16 - 8), 0, 1);
  const windPenaltySurf = 1 - clamp((W - 3) / 8, 0, 1); // >3 m/s starts to degrade
  const surfing = 100 * (
    0.5 * waveSize +
    0.35 * periodQuality +
    0.15 * windPenaltySurf
  );

  // ---- Outdoor sightseeing (0..100)
  // Mild temps (14–26°C), low precip/prob, low wind, low cloud cover
  const tempComfort = 1 - Math.abs((T - 20) / 10);      // 20°C ideal, fades by ±10°C
  const tempComfortClamped = clamp(tempComfort, 0, 1);
  const precipBad = Pp !== undefined ? Pp / 100 : clamp(P / 2, 0, 1); // either prob or intensity
  const windOk = 1 - clamp(W / 10, 0, 1);               // >10 m/s is unpleasant
  const cloudsOk = 1 - clamp(CC / 100, 0, 1);           // clearer skies better
  const outdoor = 100 * (
    0.40 * tempComfortClamped +
    0.30 * (1 - precipBad) +
    0.20 * windOk +
    0.10 * cloudsOk
  );

  // ---- Indoor sightseeing (0..100)
  // Best when outdoor is bad: rain/wind/extreme temps boost indoor
  const extremeTemp = clamp(Math.abs(T - 20) / 15, 0, 1); // far from 20°C
  const indoor = 100 * (
    0.45 * precipBad +
    0.30 * clamp(W / 10, 0, 1) +
    0.25 * extremeTemp
  );

  let scores: ActivityScore[] = [
    { activity: "Skiing", score: skiing },
    { activity: "Surfing", score: surfing },
    { activity: "Outdoor sightseeing", score: outdoor },
    { activity: "Indoor sightseeing", score: indoor },
  ];

  // Rank high→low and return the ordered list
  scores = scores.map(s => ({ ...s, score: Math.round(s.score) }));
  return scores.sort((a, b) => b.score - a.score);
}

async function getRankings(latitude: number, longitude: number) {
  let openMeteo = await getOpenMeteo(latitude, longitude);
  let activities = rankActivities(openMeteo.wx, openMeteo.sea);
  console.log(activities);
  return activities;
}

export default rankerResolvers;