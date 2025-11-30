import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WeatherUI } from '@/src/features/weather';
import { NewsCarousel } from '@/src/features/news';

const FEATURES_DATA = [
  {
    icon: "🩺",
    title: "수정벌 진단",
    description: "AI 기반 이미지 분석으로 수정벌의 건강 상태와 질병을 정확하게 진단해드립니다 ↗",
    link: "/diagnosis",
  },
  {
    icon: "🌾",
    title: "수정벌 추천",
    description: "재배하시는 농작물의 특성에 맞는 최적의 수정벌 품종을 추천해드립니다 ↗",
    link: "/recommend",
  },
  {
    icon: "🫱🏻‍🫲🏻",
    title: "거래 연결",
    description: "신뢰할 수 있는 양봉장들과 직접 연결하여 안전한 수정벌 거래를 지원합니다 ↗",
    link: "/search",
  },
  {
    icon: "📺",
    title: "수정벌 소식",
    description: "벌에 관한 모든 소식, 생태 환경, 정책 변화, 기술 동향을 확인할 수 있습니다. ↗",
    link: "/news",
  },
  {
    icon: "🔍",
    title: "맞춤 농약",
    description: "수정벌에 따른 농약 사용 궁금하신 분들을 위해 맞춤 농약 추천 서비스를 제공합니다 ↗",
    link: "/pesticide",
  },
  {
    icon: "🤖",
    title: "챗봇 기능",
    description: "수정벌 관련 궁금한 점들을 24시간 언제든지 AI챗봇과 대화로 해결하세요",
  },
];

export default function Home() {
  const router = useRouter();

  const handleClick = (link?: string) => {
    if (!link) return;
    router.push(link);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* 날씨 위젯 */}
      <WeatherUI />

      {/* 기능 섹션 */}
      <Text className="text-xl font-bold text-main-900 mt-8 mb-4">
        Webee의 특별한 기능을 누려보세요!
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {FEATURES_DATA.map((feature) => (
          <TouchableOpacity
            key={feature.title}
            onPress={() => handleClick(feature.link)}
            activeOpacity={0.8}
            className="w-[31%] pb-4"
          >
            <View className="w-full h-25 bg-main-500 rounded-xl flex flex-col items-center justify-center py-2">
              <Text className="text-3xl py-2">{feature.icon}</Text>
              <Text className="text-sm font-medium text-gray-900 text-center" numberOfLines={2}>
                {feature.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 뉴스 섹션 */}
      <Text className="text-xl font-bold text-main-900 mt-6 mb-4">
        오늘의 주요 뉴스를 확인하세요!
      </Text>
      <NewsCarousel />
    </ScrollView>
  );
}
