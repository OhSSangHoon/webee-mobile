import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import type { Recommendation } from '@/types';

export default function RecommendationHistoryScreen() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data } = await api.get<Recommendation[]>('/api/recommendations');
      return data;
    },
  });

  if (isLoading) {
    return <Loading text="추천 기록을 불러오는 중..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">추천 기록</Text>

        {!recommendations || recommendations.length === 0 ? (
          <Card className="items-center py-12">
            <Text className="text-6xl mb-4">💡</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              추천 기록이 없습니다
            </Text>
            <Text className="text-gray-600 text-center">
              맞춤형 수정벌 추천을 받아보세요
            </Text>
          </Card>
        ) : (
          <View className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id}>
                <View className="flex-row items-center mb-3">
                  <View className="px-3 py-1 bg-blue-100 rounded-full mr-2">
                    <Text className="text-sm font-medium text-blue-700">
                      {recommendation.cropType}
                    </Text>
                  </View>
                  <View className="px-3 py-1 bg-green-100 rounded-full">
                    <Text className="text-sm font-medium text-green-700">
                      {recommendation.cultivationMethod === 'greenhouse' ? '온실' : '노지'}
                    </Text>
                  </View>
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600">
                    면적: {recommendation.area}㎡ | 예산: {recommendation.budget.toLocaleString()}원
                  </Text>
                  {recommendation.region && (
                    <Text className="text-sm text-gray-600">지역: {recommendation.region}</Text>
                  )}
                </View>
                <Text className="text-gray-700 leading-6 mb-3">{recommendation.results}</Text>
                <Text className="text-xs text-gray-500">
                  {new Date(recommendation.createdAt).toLocaleString('ko-KR')}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
