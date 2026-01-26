import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import type { Diagnosis } from '@/types';

export default function DiagnosisHistoryScreen() {
  const { data: diagnoses, isLoading } = useQuery({
    queryKey: ['diagnoses'],
    queryFn: async () => {
      const { data } = await api.get<Diagnosis[]>('/api/diagnoses');
      return data;
    },
  });

  if (isLoading) {
    return <Loading text="진단 기록을 불러오는 중..." />;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">진단 기록</Text>

        {!diagnoses || diagnoses.length === 0 ? (
          <Card className="items-center py-12">
            <Text className="text-6xl mb-4">📋</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              진단 기록이 없습니다
            </Text>
            <Text className="text-gray-600 text-center">
              벌의 건강 상태를 진단해보세요
            </Text>
          </Card>
        ) : (
          <View className="space-y-4">
            {diagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} className="overflow-hidden">
                {diagnosis.imageUrl && (
                  <Image
                    source={{ uri: diagnosis.imageUrl }}
                    className="w-full h-48 rounded-xl mb-4"
                    resizeMode="cover"
                  />
                )}
                <View className={`px-3 py-2 rounded-lg mb-3 ${getSeverityColor(diagnosis.severity)}`}>
                  <Text className="font-semibold">{diagnosis.diseaseName}</Text>
                </View>
                <View className="mb-2">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">증상</Text>
                  <Text className="text-gray-600">{diagnosis.symptoms}</Text>
                </View>
                <View className="mb-2">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">권장 조치</Text>
                  <Text className="text-gray-600">{diagnosis.recommendations}</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-3">
                  {new Date(diagnosis.createdAt).toLocaleString('ko-KR')}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
