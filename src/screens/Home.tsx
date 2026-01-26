import { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWeather, getWeatherIcon } from '@/features/weather';
import { Card } from '@/components/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const NEWS_CARD_WIDTH = SCREEN_WIDTH - 44;

const TIPS = [
  { id: '1', title: '온도 관리', content: '뒤영벌은 10~28도에서 가장 활발합니다', condition: '일반' },
  { id: '2', title: '농약 주의', content: '수정벌 투입 전 농약 사용을 중단하세요', condition: '주의' },
  { id: '3', title: '습도 체크', content: '습도가 높으면 벌의 활동량이 감소합니다', condition: '일반' },
];

interface Farm {
  id: string;
  name: string;
  location: string;
  crop: string;
  facilityType: string;
  area: string;
}

interface NewsItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  source: string;
}

// TODO: 실제 API 연동 후 데이터 가져오기
const sampleFarms: Farm[] = [];

const sampleNews: NewsItem[] = [
  { id: '1', title: '2026년 수정벌 지원사업 신청 시작', preview: '농림축산식품부에서 올해 수정벌 보급 지원사업을 확대 시행합니다...', date: '2026.01.26', source: '농업신문' },
  { id: '2', title: '겨울철 수정벌 관리 요령', preview: '저온기 시설하우스에서 수정벌의 활동성을 높이기 위한 관리 방법...', date: '2026.01.24', source: '농촌진흥청' },
  { id: '3', title: '토마토 농가 수정벌 활용 성공사례', preview: '경남 창원시 토마토 재배 농가에서 수확량을 30% 향상시킨 사례...', date: '2026.01.22', source: '농업기술센터' },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { weather, loading: weatherLoading } = useWeather();
  const [currentFarmIndex, setCurrentFarmIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const userName = user?.fullName || user?.username || '사용자';
  const today = new Date();
  const dateString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  const onFarmScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setCurrentFarmIndex(index);
  };

  const onTipScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setCurrentTipIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. 인사말 + 날씨 */}
        <View className="px-4 pt-4 mb-4">
          <Card>
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-sm text-gray-500 mb-1">{dateString}</Text>
                <Text className="text-xl font-bold text-gray-900">
                  안녕하세요, {userName}님
                </Text>
              </View>
              {weather && !weatherLoading ? (
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-xl bg-yellow-50 items-center justify-center mr-2">
                    <Feather name={getWeatherIcon(weather.icon)} size={24} color="#F59E0B" />
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-gray-900">{weather.temperature}°</Text>
                    <Text className="text-sm text-gray-500">{weather.description}</Text>
                  </View>
                </View>
              ) : weatherLoading ? (
                <Text className="text-sm text-gray-400">날씨 로딩중...</Text>
              ) : null}
            </View>
          </Card>
        </View>

        {/* 2. 팁 배너 캐러셀 */}
        <View className="mb-4">
          <FlatList
            data={TIPS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            onScroll={onTipScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className="bg-yellow-400 rounded-2xl p-4"
                style={{ width: CARD_WIDTH }}
              >
                <View className="self-start bg-black/10 px-2.5 py-1 rounded-full mb-2">
                  <Text className="text-xs font-semibold text-black">{item.condition}</Text>
                </View>
                <Text className="text-base font-bold text-black mb-1">{item.title}</Text>
                <Text className="text-sm text-black/70">{item.content}</Text>
              </View>
            )}
          />
          {TIPS.length > 1 && (
            <View className="flex-row justify-center mt-3 gap-1.5">
              {TIPS.map((_, index) => (
                <View
                  key={index}
                  className={`h-1.5 rounded-full ${index === currentTipIndex ? 'w-4 bg-yellow-500' : 'w-1.5 bg-gray-300'}`}
                />
              ))}
            </View>
          )}
        </View>

        {/* 3. 내 농지 섹션 */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-4 mb-2">
            <Text className="text-lg font-bold text-gray-900">내 농지</Text>
          </View>

          {sampleFarms.length > 0 ? (
            <>
              <FlatList
                data={sampleFarms}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 12}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                onScroll={onFarmScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    className="bg-white rounded-2xl p-4 active:scale-[0.98]"
                    style={{ width: CARD_WIDTH }}
                  >
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center mr-3">
                        <Feather name="home" size={18} color="#3B82F6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                        <Text className="text-sm text-gray-500 mt-0.5">{item.location}</Text>
                      </View>
                      <Feather name="chevron-right" size={20} color="#C7C7CC" />
                    </View>
                    <View className="h-px bg-gray-100 my-3" />
                    <View className="flex-row">
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-500 mb-1">작물</Text>
                        <Text className="text-sm font-semibold text-gray-900">{item.crop}</Text>
                      </View>
                      <View className="w-px bg-gray-100" />
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-500 mb-1">시설</Text>
                        <Text className="text-sm font-semibold text-gray-900">{item.facilityType}</Text>
                      </View>
                      <View className="w-px bg-gray-100" />
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-500 mb-1">면적</Text>
                        <Text className="text-sm font-semibold text-gray-900">{item.area}</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
              {sampleFarms.length > 1 && (
                <View className="flex-row justify-center mt-3 gap-1.5">
                  {sampleFarms.map((_, index) => (
                    <View
                      key={index}
                      className={`h-1.5 rounded-full ${index === currentFarmIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-300'}`}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View className="mx-4 bg-white rounded-2xl p-8 items-center">
              <Feather name="map" size={32} color="#C7C7CC" />
              <Text className="text-base font-semibold text-gray-900 mt-3">등록된 농지가 없습니다</Text>
              <Text className="text-sm text-gray-500 mt-1">마이페이지에서 농지를 등록해주세요</Text>
            </View>
          )}
        </View>

        {/* 4. 리포트 이동 링크 */}
        <View className="px-4 mb-4">
          <Pressable
            onPress={() => router.push('/diagnose')}
            className="bg-white rounded-2xl p-4 flex-row items-center active:scale-[0.98]"
          >
            <View className="w-13 h-13 rounded-xl bg-yellow-100 items-center justify-center mr-3">
              <Feather name="edit-3" size={24} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">농장 환경 리포트</Text>
              <Text className="text-sm text-gray-500 mt-0.5">환경 데이터를 입력하고 맞춤 분석 받기</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* 5. 수정벌 뉴스 캐러셀 */}
        <View className="mb-8"> 
          <View className="flex-row items-center justify-between px-4 mb-2">
            <Text className="text-lg font-bold text-gray-900">수정벌 뉴스</Text>
            <Pressable className="flex-row items-center">
              <Text className="text-sm text-gray-500">전체보기</Text>
              <Feather name="chevron-right" size={16} color="#8E8E93" />
            </Pressable>
          </View>

          <FlatList
            data={sampleNews}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={NEWS_CARD_WIDTH + 12}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="bg-white rounded-2xl p-4 active:scale-[0.98]"
                style={{ width: NEWS_CARD_WIDTH }}
              >
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs font-semibold text-blue-600">{item.source}</Text>
                  <Text className="text-xs text-gray-400">{item.date}</Text>
                </View>
                <Text className="text-base font-semibold text-gray-900 mb-2" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500 mb-3" numberOfLines={2}>
                  {item.preview}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-sm font-semibold text-blue-600">자세히 보기</Text>
                  <Feather name="arrow-right" size={14} color="#3B82F6" />
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
