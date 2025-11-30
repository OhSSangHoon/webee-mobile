/**
 * 날씨 데이터 타입
 */
export type WeatherData = {
  name: string;
  weather: { main: string; description: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  sys: { sunrise: number; sunset: number };
  wind: { speed: number };
};

/**
 * 예보 데이터 타입
 */
export type ForecastData = {
  list: {
    dt: number;
    main: { temp: number; temp_min: number; temp_max: number };
    weather: { main: string; description: string }[];
  }[];
};

/**
 * 주소 데이터 타입
 */
export type AddressData = {
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

/**
 * 일별 예보 데이터 타입
 */
export type DailyForecast = {
  dt: number;
  temp_min: number;
  temp_max: number;
  weather: { main: string; description: string };
};

/**
 * 상세 날씨 데이터 타입 (농업기상정보)
 */
export type DetailWeatherData = {
  stn_Code: string;
  stn_Name: string;
  date: string;
  temp: string;
  max_Temp: string;
  min_Temp: string;
  hum: string;
  widdir: string;
  wind: string;
  max_Wind: string;
  rain: string;
  sun_Time: string;
  sun_Qy: string;
  condens_Time: string;
  gr_Temp: string;
  soil_Temp: string;
  soil_Wt: string;
};

/**
 * 메인 날씨 데이터 상태 타입
 */
export type WeatherState = {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  koreanAddress: string;
  loading: boolean;
  error: string;
};

/**
 * 농업기상 데이터 상태 타입
 */
export type DetailWeatherState = {
  data: DetailWeatherData | null;
  loading: boolean;
  error: string;
};

/* 온도별 벌 행동 타입 */
export type TemperatureInfo = {
  range: string;
  behavior: string;
};
