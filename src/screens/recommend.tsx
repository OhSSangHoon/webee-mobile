import { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import type { RecommendationResponse } from '@/types';

const CROP_OPTIONS = ['딸기', '토마토', '고추', '오이', '호박', '수박', '참외', '멜론', '블루베리', '사과', '배', '기타'];

export default function RecommendScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cropType: '',
    cultivationMethod: 'greenhouse',
    area: '',
    region: '',
    budget: '',
  });
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const recommendMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.post<RecommendationResponse>('/api/recommendations', data);
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      Alert.alert('오류', error.response?.data?.error || '추천 생성에 실패했습니다');
    },
  });

  const handleSubmit = () => {
    if (!formData.cropType) {
      Alert.alert('알림', '작물을 선택해주세요');
      return;
    }
    if (!formData.area || parseFloat(formData.area) <= 0) {
      Alert.alert('알림', '재배 면적을 입력해주세요');
      return;
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      Alert.alert('알림', '예산을 입력해주세요');
      return;
    }

    recommendMutation.mutate({
      cropType: formData.cropType,
      cultivationMethod: formData.cultivationMethod,
      area: parseFloat(formData.area),
      region: formData.region,
      budget: parseFloat(formData.budget),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">수정벌 추천</Text>
        <Text className="text-gray-600 mb-6">
          재배 정보를 입력하면 맞춤형 수정벌을 추천해드립니다
        </Text>

        {!result ? (
          <>
            <Card className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">작물 선택</Text>
              <View className="flex-row flex-wrap gap-2">
                {CROP_OPTIONS.map((crop) => (
                  <Pressable
                    key={crop}
                    onPress={() => setFormData({ ...formData, cropType: crop })}
                    className={`px-4 py-2 rounded-full ${
                      formData.cropType === crop ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        formData.cropType === crop ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {crop}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Card>

            <Card className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">재배 방식</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setFormData({ ...formData, cultivationMethod: 'greenhouse' })}
                  className={`flex-1 px-4 py-3 rounded-xl ${
                    formData.cultivationMethod === 'greenhouse' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      formData.cultivationMethod === 'greenhouse' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    온실
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setFormData({ ...formData, cultivationMethod: 'outdoor' })}
                  className={`flex-1 px-4 py-3 rounded-xl ${
                    formData.cultivationMethod === 'outdoor' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      formData.cultivationMethod === 'outdoor' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    노지
                  </Text>
                </Pressable>
              </View>
            </Card>

            <Input
              label="재배 면적 (㎡)"
              value={formData.area}
              onChangeText={(text) => setFormData({ ...formData, area: text })}
              keyboardType="numeric"
              placeholder="예: 1000"
              containerClassName="mb-4"
            />

            <Input
              label="지역"
              value={formData.region}
              onChangeText={(text) => setFormData({ ...formData, region: text })}
              placeholder="예: 경기도 고양시"
              containerClassName="mb-4"
            />

            <Input
              label="예산 (원)"
              value={formData.budget}
              onChangeText={(text) => setFormData({ ...formData, budget: text })}
              keyboardType="numeric"
              placeholder="예: 500000"
              containerClassName="mb-6"
            />

            <Button onPress={handleSubmit} loading={recommendMutation.isPending}>
              추천받기
            </Button>

            <Pressable onPress={() => router.push('/recommend-history')} className="mt-4 py-3">
              <Text className="text-center text-blue-600 font-semibold">추천 기록 보기</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Card className="mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">추천 결과</Text>
              <Text className="text-gray-700 leading-6">{result.results}</Text>
            </Card>
            <Button
              onPress={() => {
                setResult(null);
                setFormData({
                  cropType: '',
                  cultivationMethod: 'greenhouse',
                  area: '',
                  region: '',
                  budget: '',
                });
              }}
            >
              새로 추천받기
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
