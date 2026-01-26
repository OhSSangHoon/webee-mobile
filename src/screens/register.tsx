import { useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });

  const handleRegister = async () => {
    if (!formData.username.trim()) {
      Alert.alert('알림', '사용자명을 입력해주세요');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요');
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
      router.replace('/home');
    } catch (error: any) {
      const message = error.response?.data?.error || '회원가입에 실패했습니다';
      Alert.alert('회원가입 실패', message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-12"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-blue-600 mb-2">🐝 Webee</Text>
            <Text className="text-gray-600">회원가입</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">사용자명</Text>
              <TextInput
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder="사용자명을 입력하세요"
                autoCapitalize="none"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">이메일</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">이름</Text>
              <TextInput
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="이름을 입력하세요"
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

            <Button onPress={handleRegister} loading={isLoading} className="mt-6">
              회원가입
            </Button>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600">이미 계정이 있으신가요? </Text>
              <Pressable onPress={() => router.back()}>
                <Text className="text-blue-600 font-semibold">로그인</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
