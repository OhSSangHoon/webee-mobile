import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { weatherApi } from "../api/api";
import { WeatherState } from "./types";

/**
 * 위치 기반 날씨 정보를 가져오는 커스텀 훅
 * OpenWeatherMap API와 Nominatim API를 사용하여 현재 날씨, 예보, 한글 주소를 가져옵니다.
 */
export const useWeatherData = () => {
  const [state, setState] = useState<WeatherState & { hasRequested: boolean }>({
    weatherData: null,
    forecastData: null,
    koreanAddress: "",
    loading: false,
    error: "",
    hasRequested: false,
  });

  const requestLocationData = async () => {
    setState((prev) => ({ ...prev, loading: true, hasRequested: true }));

    try {
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setState((prev) => ({
          ...prev,
          error: "위치 권한이 거부되었습니다.",
          loading: false,
        }));
        return;
      }

      // 현재 위치 가져오기
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // 병렬로 API 호출하여 성능 최적화
      const [weatherData, forecastData, koreanAddress] = await Promise.all([
        weatherApi.getCurrentWeather(latitude, longitude),
        weatherApi.getForecast(latitude, longitude),
        weatherApi.getKoreanAddress(latitude, longitude),
      ]);

      setState((prev) => ({
        ...prev,
        weatherData,
        forecastData,
        koreanAddress,
        loading: false,
        error: "",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "데이터를 가져오는 데 실패했습니다.",
        loading: false,
      }));
      console.error("데이터 오류:", error);
    }
  };

  useEffect(() => {
    requestLocationData();
  }, []);

  return { ...state, requestLocationData };
};
