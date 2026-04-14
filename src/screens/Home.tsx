import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWeather, getWeatherIcon } from "@/features/weather";
import { Card } from "@/components/Card";
import { NewsCarousel } from "@/components/NewsCarousel";

const TIPS = [
  {
    id: "1",
    title: "온도 관리",
    content: "뒤영벌은 10~28도에서 가장 활발합니다",
    condition: "일반",
  },
  {
    id: "2",
    title: "농약 주의",
    content: "수정벌 투입 전 농약 사용을 중단하세요",
    condition: "주의",
  },
  {
    id: "3",
    title: "습도 체크",
    content: "습도가 높으면 벌의 활동량이 감소합니다",
    condition: "일반",
  },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { weather, loading: weatherLoading } = useWeather();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const userName = user?.fullName || user?.username || "사용자";
  const today = new Date();
  const dateString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  const onTipScroll = (event: any) => {
    setCurrentTipIndex(currentTipIndex);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. 인사말 + 날씨 */}
        <View className="px-4 pt-4 mb-4">
          <Card>
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-sm text-gray-600 mb-1">{dateString}</Text>
                <Text className="text-xl font-bold text-gray-900">
                  안녕하세요, {userName}님
                </Text>
              </View>
              {weather && !weatherLoading ? (
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-xl bg-yellow-50 items-center justify-center mr-2">
                    <Feather
                      name={getWeatherIcon(weather.icon)}
                      size={24}
                      color="#F59E0B"
                    />
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-gray-900">
                      {weather.temperature}°
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {weather.description}
                    </Text>
                  </View>
                </View>
              ) : weatherLoading ? (
                <Text className="text-sm text-gray-600">날씨 로딩중...</Text>
              ) : null}
            </View>
          </Card>
        </View>


        {/* 4. 리포트 이동 링크 */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => router.push("/report")}
            className="bg-white rounded-2xl p-4 flex-row items-center active:scale-[0.98]"
          >
            <View className="w-13 h-13 rounded-xl bg-yellow-100 items-center justify-center mr-3">
              <Feather name="edit-3" size={24} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                농장 환경 리포트
              </Text>
              <Text className="text-sm text-gray-600 mt-0.5">
                환경 데이터를 입력하고 맞춤 분석 받기
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* 4-1. 스마트벌통 관리 이동 링크 */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => router.push("/hive-control")}
            className="bg-white rounded-2xl p-4 flex-row items-center active:scale-[0.98]"
          >
            <View className="w-13 h-13 rounded-xl bg-green-50 items-center justify-center mr-3">
              <Feather name="zap" size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                스마트벌통 관리
              </Text>
              <Text className="text-sm text-gray-600 mt-0.5">
                실시간 벌통 상태 확인·제어
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* 시세 이동 */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => router.push("fruit-price")}
            className="bg-white rounded-2xl p-4 flex-row items-center active:scale-[0.98]"
          >
            <View className="w-13 h-13 rounded-xl bg-green-50 items-center justify-center mr-3">
              <Feather name="zap" size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                시세확인
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* 5. 수정벌 뉴스 캐러셀 */}
        <NewsCarousel keyword="수정벌" title="수정벌 뉴스" />
      </ScrollView>
    </View>
  );
}
