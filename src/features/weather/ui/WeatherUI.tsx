import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useWeatherData } from "../model/hooks";
import { getWeatherIcon, getWeatherKorean, formatTime, formatDayShort, getDailyForecast, getBeeMessage, } from "../model/utils";

/**
 * 날씨 정보를 표시하는 메인 UI 컴포넌트
 * 현재 날씨, 6일 예보, 농업기상 정보를 포함합니다.
 */
export default function WeatherUI() {
  const {
    weatherData,
    forecastData,
    koreanAddress,
    loading,
    error,
    requestLocationData,
  } = useWeatherData();

  // 로딩 상태 UI
  if (loading) {
    return (
      <View className="flex items-center justify-center py-8">
        <ActivityIndicator size="large" color="#FFB800" />
        <Text className="mt-4 text-gray-600 text-base">날씨 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 에러 상태 UI
  if (error) {
    return (
      <View className="flex justify-center items-center">
        <View className="w-full max-w-6xl p-8 rounded-2xl bg-white/10 min-h-[384px]">
          <View className="text-center flex flex-col items-center justify-center h-full">
            <View className="bg-red-500/20 border border-red-400/50 px-6 py-4 rounded-lg mb-4">
              <Text className="text-red-200">{error}</Text>
            </View>
            <TouchableOpacity
              onPress={requestLocationData}
              className="bg-yellow-400 active:bg-yellow-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-gray-800 font-medium">다시 시도</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 날씨 데이터가 없는 경우
  if (!weatherData) {
    return (
      <View className="flex justify-center items-center">
        <View className="w-full max-w-6xl p-8 rounded-2xl bg-white/10 min-h-[384px]">
          <Text className="text-center text-gray-600 text-lg flex items-center justify-center h-full">
            날씨 데이터를 불러올 수 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  const dailyForecast = getDailyForecast(forecastData);

  return (
      <View className="flex flex-col items-center gap-4 pb-2 w-full">
        {/* 메인 날씨 정보 */}
        <View className="flex flex-col gap-1 items-center">
          <Text className="text-gray-900 font-semibold text-sm">
            {koreanAddress || weatherData.name}
          </Text>
          <View className="text-sub-800 text-xl font-bold flex flex-row justify-center items-center">
            <Text className="text-sub-800 text-xl font-bold">
              {Math.round(weatherData.main.temp)}°C
            </Text>
            <Text className="text-sub-800 text-xl font-bold ml-2">
              {getWeatherKorean(weatherData.weather[0].main)}
            </Text>
            <Image
              source={getWeatherIcon(weatherData.weather[0].main)}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-gray-800 text-sm font-medium">
            일출 {formatTime(weatherData.sys.sunrise)} • 일몰{" "}
            {formatTime(weatherData.sys.sunset)}
          </Text>
        </View>

        {/* 벌 관련 메시지 */}
        <View className="rounded-xl w-full bg-main-400 flex items-center justify-center py-3 px-4">
          <Text className="text-main-900 font-semibold text-base text-center">
            {getBeeMessage(weatherData)}
          </Text>
        </View>

        {/* 위치 확인 안내 메시지 */}
        <View className="flex flex-col justify-center items-center">
          <Text className="text-gray-800 text-sm text-center font-medium">
            날씨 정보를 보려면{" "}
            <Text className="underline">내 위치 확인</Text>을 허용해 주세요.
          </Text>
        </View>

        {/* 5일 예보 */}
        {forecastData && (
          <View className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 }}>
            <View className="flex flex-row gap-2">
              {dailyForecast.map((day, index) => {
                return (
                  <View
                    key={index}
                    className="bg-gray-200 rounded-lg text-center py-0.75 flex-1"
                  >
                    <Text className="text-sm font-medium text-gray-900 text-center">
                      {formatDayShort(day.dt)}
                    </Text>
                    <View className="flex justify-center items-center">
                      <Image
                        source={getWeatherIcon(day.weather.main)}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 농업기상 정보 사이드바 */}
        <View className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 }}>
          <View className="flex flex-row gap-2">
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">온도</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">10˚</Text>
            </View>
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">습도</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">84%</Text>
            </View>
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">풍향</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">0.1</Text>
            </View>
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">풍속</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">0.1</Text>
            </View>
          </View>
          <View className="flex flex-row gap-2 mt-2">
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">강수량</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">10mm</Text>
            </View>
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">일사량</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">0</Text>
            </View>
            <View className="rounded-lg p-3 bg-gray-200 flex-1 items-center">
              <Text className="text-gray-700 text-sm font-medium text-center">토양수분</Text>
              <Text className="text-lg font-semibold text-sub-800 text-center">0</Text>
            </View>
          </View>
        </View>
      </View>
  );
}
