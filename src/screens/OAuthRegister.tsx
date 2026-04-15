import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';

export default function OAuthRegisterScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('알림', '전화번호를 입력해주세요');
      return;
    }
    if (!/^010\d{8}$/.test(phoneNumber)) {
      Alert.alert('알림', '올바른 전화번호를 입력해주세요 (예: 01012345678)');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/v1/oauth/register', { phoneNumber });
      router.replace('/home');
    } catch (error: any) {
      const message = error.response?.data?.message || '정보 등록에 실패했습니다';
      Alert.alert('오류', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 px-6 pt-10">
        <Text className="text-2xl font-bold text-gray-900 mb-2">추가 정보 입력</Text>
        <Text className="text-base text-gray-500 mb-10">서비스 이용을 위해 전화번호를 입력해주세요</Text>

        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-2">전화번호</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="01012345678"
            keyboardType="phone-pad"
            maxLength={11}
            className="w-full px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-base"
            placeholderTextColor="#9ca3af"
            style={{ height: 52 }}
          />
        </View>
      </View>

      <View className="px-6 pb-10">
        <Button onPress={handleRegister} loading={isLoading}>
          완료
        </Button>
      </View>
    </SafeAreaView>
  );
}
