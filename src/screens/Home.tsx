import { useState } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWeather, getWeatherIcon } from '@/features/weather';
import { useFarmList } from '@/features/farm';
import { Card } from '@/components/Card';
import { NewsCarousel } from '@/components/NewsCarousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

const TIPS = [
  { id: '1', title: '온도 관리', content: '뒤영벌은 10~28도에서 가장 활발합니다', condition: '일반' },
  { id: '2', title: '농약 주의', content: '수정벌 투입 전 농약 사용을 중단하세요', condition: '주의' },
  { id: '3', title: '습도 체크', content: '습도가 높으면 벌의 활동량이 감소합니다', condition: '일반' },
];

// 재배 방식 라벨 변환
const getCultivationTypeLabel = (type: string) => {
  return type === 'CONTROLLED' ? '시설재배' : '노지재배';
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { weather, loading: weatherLoading } = useWeather();
  const { data: farms = [], isLoading: farmsLoading } = useFarmList();
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
                    <Feather name={getWeatherIcon(weather.icon)} size={24} color="#F59E0B" />
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-gray-900">{weather.temperature}°</Text>
                    <Text className="text-sm text-gray-600">{weather.description}</Text>
                  </View>
                </View>
              ) : weatherLoading ? (
                <Text className="text-sm text-gray-600">날씨 로딩중...</Text>
              ) : null}
            </View>
          </Card>
        </View>

        {/* 2. 팁 배너 캐러셀 */}
        <View className="mb-6">
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
                  className={`h-1.5 rounded-full ${index === currentTipIndex ? 'w-4 bg-yellow-500' : 'w-1.5 bg-gray-400'}`}
                />
              ))}
            </View>
          )}
        </View>

        {/* 3. 내 농지 섹션 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-4 mb-2">
            <Text className="text-lg font-bold text-gray-900">내 농지</Text>
            <Pressable onPress={() => router.push('/add-farm')}>
              <Feather name="plus" size={22} color="#6B7280" />
            </Pressable>
          </View>

          {farmsLoading ? (
            <View className="mx-4 bg-white rounded-2xl p-8 items-center">
              <Text className="text-sm text-gray-600">로딩중...</Text>
            </View>
          ) : farms.length > 0 ? (
            <>
              <FlatList
                data={farms}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 12}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                onScroll={onFarmScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    className="bg-white rounded-2xl p-4 active:scale-[0.98]"
                    style={{ width: CARD_WIDTH }}
                  >
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center mr-3">
                        <Feather
                          name={item.cultivationType === 'CONTROLLED' ? 'home' : 'sun'}
                          size={18}
                          color="#3B82F6"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {item.name || '이름 없음'}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-0.5">
                          {item.cultivationAddress || '주소 미등록'}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={20} color="#C7C7CC" />
                    </View>
                    <View className="h-px bg-gray-100 my-3" />
                    <View className="flex-row">
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-600 mb-1">작물</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {item.name || '-'}
                        </Text>
                      </View>
                      <View className="w-px bg-gray-100" />
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-600 mb-1">시설</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {getCultivationTypeLabel(item.cultivationType)}
                        </Text>
                      </View>
                      <View className="w-px bg-gray-100" />
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-600 mb-1">면적</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {item.cultivationArea}평
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
              {farms.length > 1 && (
                <View className="flex-row justify-center mt-3 gap-1.5">
                  {farms.map((_, index) => (
                    <View
                      key={index}
                      className={`h-1.5 rounded-full ${index === currentFarmIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-400'}`}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Pressable
              onPress={() => router.push('/add-farm')}
              className="mx-4 bg-white rounded-2xl p-8 items-center active:scale-[0.98]"
            >
              <Feather name="map" size={32} color="#C7C7CC" />
              <Text className="text-base font-semibold text-gray-900 mt-3">등록된 농지가 없습니다</Text>
              <Text className="text-sm text-gray-600 mt-1">탭하여 농지를 등록해보세요</Text>
            </Pressable>
          )}
        </View>

        {/* 4. 리포트 이동 링크 */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => router.push('/report')}
            className="bg-white rounded-2xl p-4 flex-row items-center active:scale-[0.98]"
          >
            <View className="w-13 h-13 rounded-xl bg-yellow-100 items-center justify-center mr-3">
              <Feather name="edit-3" size={24} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">농장 환경 리포트</Text>
              <Text className="text-sm text-gray-600 mt-0.5">환경 데이터를 입력하고 맞춤 분석 받기</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#C7C7CC" />
          </Pressable>
        </View>

        {/* 4-1. 스마트벌통 관리 이동 링크 */}
        <View className="px-4 mb-6">
          <Pressable
            onPress={() => router.push('/hive-control')}
            className="bg-white rounded-2xl p-4 flex-row items-center active:scale-[0.98]"
          >
            <View className="w-13 h-13 rounded-xl bg-green-50 items-center justify-center mr-3">
              <Feather name="zap" size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">스마트벌통 관리</Text>
              <Text className="text-sm text-gray-600 mt-0.5">실시간 벌통 상태 확인·제어</Text>
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
