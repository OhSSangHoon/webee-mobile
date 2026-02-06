import { useState } from 'react';
import { View, Text, TextInput, Alert, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/Button';
import { useKeyboard } from '@/hooks/useKeyboard';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
  });

  const handleRegister = async () => {
    if (!formData.username.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요');
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('알림', '전화번호를 입력해주세요');
      return;
    }
    if (!/^010\d{8}$/.test(formData.phoneNumber)) {
      Alert.alert('알림', '전화번호 형식이 올바르지 않습니다 (01012345678)');
      return;
    }
    if (!formData.password) {
      Alert.alert('알림', '비밀번호를 입력해주세요');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자 이상이어야 합니다');
      return;
    }

    try {
      await register(formData);
      Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다', [
        { text: '확인', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || '회원가입에 실패했습니다';
      Alert.alert('회원가입 실패', message);
    }
  };

  const { isVisible: isKeyboardVisible, keyboardHeight } = useKeyboard();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </Pressable>
        <View className="flex-1" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: isKeyboardVisible ? keyboardHeight + 100 : 120
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-10">
          <Text className="text-gray-900 text-3xl font-bold">회원가입</Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">아이디</Text>
            <TextInput
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              placeholder="아이디를 입력하세요"
              autoCapitalize="none"
              className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">이름</Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="이름을 입력하세요"
              className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">전화번호</Text>
            <TextInput
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text.replace(/[^0-9]/g, '') })}
              placeholder="01012345678"
              keyboardType="phone-pad"
              maxLength={11}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">비밀번호</Text>
            <TextInput
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              secureTextEntry
              className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">이미 계정이 있으신가요? </Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-blue-600 font-semibold">로그인</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 px-6 pt-3 bg-white"
        style={{
          bottom: isKeyboardVisible ? keyboardHeight : 0,
          paddingBottom: isKeyboardVisible ? 12 : insets.bottom + 16,
        }}
      >
        <Button onPress={handleRegister} loading={isLoading}>
          회원가입
        </Button>
      </View>
    </SafeAreaView>
  );
}
