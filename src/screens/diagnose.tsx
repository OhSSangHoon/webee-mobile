import { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import type { DiagnosisResponse } from '@/types';

export default function DiagnoseScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResponse | null>(null);

  const diagnoseMutation = useMutation({
    mutationFn: async (data: { imageBase64?: string; imageUrl?: string }) => {
      const { data: response } = await api.post<DiagnosisResponse>('/api/diagnoses', data);
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      Alert.alert('오류', error.response?.data?.error || '진단에 실패했습니다');
    },
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
      setResult(null);
    }
  };

  const handleDiagnose = () => {
    if (!imageBase64) {
      Alert.alert('알림', '이미지를 선택해주세요');
      return;
    }

    diagnoseMutation.mutate({ imageBase64 });
  };

  const getSeverityColor = (severity?: string) => {
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
        <Text className="text-2xl font-bold text-gray-900 mb-2">벌 건강 진단</Text>
        <Text className="text-gray-600 mb-6">
          벌의 사진을 촬영하거나 업로드하여 건강 상태를 진단하세요
        </Text>

        {!imageUri ? (
          <View className="space-y-3">
            <Pressable
              onPress={takePhoto}
              className="bg-white rounded-2xl p-6 shadow-sm active:scale-95 flex-row items-center"
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="camera" size={24} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">사진 촬영</Text>
                <Text className="text-sm text-gray-500">카메라로 직접 촬영하기</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={pickImage}
              className="bg-white rounded-2xl p-6 shadow-sm active:scale-95 flex-row items-center"
            >
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="images" size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">갤러리에서 선택</Text>
                <Text className="text-sm text-gray-500">저장된 사진 불러오기</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push('/diagnose-history')}
              className="bg-blue-50 rounded-2xl p-6 active:scale-95 flex-row items-center"
            >
              <Ionicons name="time" size={24} color="#2563eb" />
              <Text className="ml-3 text-base font-semibold text-blue-600">진단 기록 보기</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Card className="mb-4">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-64 rounded-xl"
                resizeMode="cover"
              />
              <Button
                onPress={() => {
                  setImageUri(null);
                  setImageBase64(null);
                  setResult(null);
                }}
                variant="outline"
                className="mt-4"
              >
                다시 선택
              </Button>
            </Card>

            {!result && (
              <Button
                onPress={handleDiagnose}
                loading={diagnoseMutation.isPending}
                className="mb-4"
              >
                진단하기
              </Button>
            )}

            {result && (
              <Card className="mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">진단 결과</Text>
                <View className={`px-3 py-2 rounded-lg mb-3 ${getSeverityColor(result.result.severity)}`}>
                  <Text className="font-semibold">{result.result.diseaseName}</Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">신뢰도</Text>
                  <Text className="text-gray-600">{(result.result.confidence * 100).toFixed(1)}%</Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">증상</Text>
                  <Text className="text-gray-600">{result.result.symptoms}</Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-1">권장 조치</Text>
                  <Text className="text-gray-600">{result.result.recommendations}</Text>
                </View>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
