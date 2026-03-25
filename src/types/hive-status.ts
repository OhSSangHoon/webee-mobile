import { Feather } from "@expo/vector-icons";

export type Period = "일간" | "주간" | "월간";

export interface DataPoint {
  label: string;
  temp: number;
  humidity: number;
  methane: number;
  co2: number;
}

export interface HiveInfo {
  id: string;
  name: string;
  status: "online" | "offline";
}

export interface WeatherDay {
  day: string;
  date: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  high: number | null;
  low: number | null;
  condition: string;
  humidity: number | null;
}

export interface TodayWeatherData {
  temperature: number | null;
  humidity: number | null;
  high: number | null;
  low: number | null;
  condition: string;
  icon: string;
  iconColor: string;
}
