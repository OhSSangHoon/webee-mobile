import Constants from "expo-constants";
import { WeatherData, ForecastData, AddressData } from "../model/types";

/**
 * 기본 날씨 API
 */
export const weatherApi = {
  /**
   * 현재 날씨 데이터 가져오기
   */
  getCurrentWeather: async (
    latitude: number,
    longitude: number
  ): Promise<WeatherData> => {
    const apiKey = Constants.expoConfig?.extra?.WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error("현재 날씨 API 호출 실패");
    }

    return response.json();
  },

  /**
   * 7일 예보 데이터 가져오기
   */
  getForecast: async (
    latitude: number,
    longitude: number
  ): Promise<ForecastData> => {
    const apiKey = Constants.expoConfig?.extra?.WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error("예보 API 호출 실패");
    }

    return response.json();
  },

  /**
   * 한글 주소 가져오기 (Nominatim API)
   */
  getKoreanAddress: async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ko`
    );

    if (!response.ok) {
      throw new Error("주소 API 호출 실패");
    }

    const addressData: AddressData = await response.json();
    const addr = addressData.address;
    const fullKoreanAddr =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state ||
      "알 수 없는 위치";

    // nominatim api의 한글주소와 농업기상관측소 주소 맞추기 위해 2글자로 자름
    return fullKoreanAddr.substring(0, 2);
  },
};
