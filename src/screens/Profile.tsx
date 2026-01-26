import { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    cultivationAddress: user?.cultivationAddress || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      Alert.alert('성공', '프로필이 업데이트되었습니다');
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.error || '프로필 업데이트에 실패했습니다');
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.fullName || user?.username}
          </Text>
          <Text className="text-gray-600">{user?.email}</Text>
        </View>

        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">내 정보</Text>
            <Pressable onPress={() => setIsEditing(!isEditing)}>
              <Text className="text-blue-600 font-semibold">
                {isEditing ? '취소' : '수정'}
              </Text>
            </Pressable>
          </View>

          {isEditing ? (
            <>
              <Input
                label="이름"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                containerClassName="mb-3"
              />
              <Input
                label="이메일"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                containerClassName="mb-3"
              />
              <Input
                label="전화번호"
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                keyboardType="phone-pad"
                containerClassName="mb-3"
              />
              <Input
                label="재배지 주소"
                value={formData.cultivationAddress}
                onChangeText={(text) => setFormData({ ...formData, cultivationAddress: text })}
                containerClassName="mb-4"
              />
              <Button onPress={handleSave} loading={isLoading}>
                저장
              </Button>
            </>
          ) : (
            <>
              <View className="mb-3">
                <Text className="text-sm text-gray-500 mb-1">사용자명</Text>
                <Text className="text-gray-900">{user?.username}</Text>
              </View>
              <View className="mb-3">
                <Text className="text-sm text-gray-500 mb-1">이름</Text>
                <Text className="text-gray-900">{user?.fullName || '-'}</Text>
              </View>
              <View className="mb-3">
                <Text className="text-sm text-gray-500 mb-1">이메일</Text>
                <Text className="text-gray-900">{user?.email || '-'}</Text>
              </View>
              <View className="mb-3">
                <Text className="text-sm text-gray-500 mb-1">전화번호</Text>
                <Text className="text-gray-900">{user?.phoneNumber || '-'}</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500 mb-1">재배지 주소</Text>
                <Text className="text-gray-900">{user?.cultivationAddress || '-'}</Text>
              </View>
            </>
          )}
        </Card>

        <Pressable
          onPress={() => {}}
          className="bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between active:scale-95"
        >
          <View className="flex-row items-center">
            <Ionicons name="cart" size={24} color="#6b7280" />
            <Text className="ml-3 text-gray-900 font-medium">주문 내역</Text>
          </View>
          <View className="px-3 py-1 bg-gray-100 rounded-full">
            <Text className="text-xs font-medium text-gray-600">개발 중</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleLogout}
          className="bg-white rounded-2xl p-4 mb-3 flex-row items-center active:scale-95"
        >
          <Ionicons name="log-out" size={24} color="#ef4444" />
          <Text className="ml-3 text-red-600 font-medium">로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
