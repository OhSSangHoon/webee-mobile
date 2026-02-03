import { useState } from 'react';
import { Platform, Pressable, View, Image, TextInput, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/Button';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  onPress: () => void;
}

function SocialButton({ icon, label, bgColor, textColor, borderColor, onPress }: SocialButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`flex-row items-center justify-center h-14 rounded-xl gap-2.5 ${borderColor ? 'border' : ''}`}
      style={[{ backgroundColor: bgColor, borderColor }, animatedStyle]}
    >
      {icon}
      <Text className="text-base font-semibold" style={{ color: textColor }}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSocialLogin = async (provider: string) => {
    if (provider === '카카오') {
      // 임시: 카카오 버튼 클릭 시 홈으로 이동
      router.replace('/home');
      return;
    }
    // TODO: 소셜 로그인 구현
    Alert.alert('알림', `${provider} 로그인은 준비 중입니다.`);
  };

  const handleEmailLogin = async () => {
    if (!username.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요');
      return;
    }
    if (!password) {
      Alert.alert('알림', '비밀번호를 입력해주세요');
      return;
    }

    try {
      await login({ username: username.trim(), password });
      router.replace('/home');
    } catch (error: any) {
      const message = error.response?.data?.message || '로그인에 실패했습니다';
      Alert.alert('로그인 실패', message);
    }
  };

  const handleGoToRegister = () => {
    router.push('/register');
  };

  // 이메일 로그인 폼 화면
  if (showEmailLogin) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-1 justify-center px-6"
            keyboardShouldPersistTaps="handled"
          >
            {/* 뒤로가기 */}
            <Pressable
              onPress={() => setShowEmailLogin(false)}
              className="absolute top-4 left-0 p-2"
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </Pressable>

            {/* 로고 */}
            <View className="items-center mb-10">
              <Image
                source={require('../../assets/branding/webee_logo.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold text-black mt-4">로그인</Text>
            </View>

            {/* 입력 폼 */}
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">아이디</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="아이디를 입력하세요"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">비밀번호</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  secureTextEntry
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <Button
                onPress={handleEmailLogin}
                loading={isLoading}
                className="mt-4"
              >
                로그인
              </Button>

              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-600">계정이 없으신가요? </Text>
                <Pressable onPress={handleGoToRegister}>
                  <Text className="text-blue-600 font-semibold">회원가입</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // 소셜 로그인 선택 화면
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between pb-8">
        {/* 로고 섹션 */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          className="flex-1 justify-center items-center"
        >
          <View className="w-28 h-28 mb-6 items-center justify-center">
            <Image
              source={require('../../assets/branding/webee_logo.png')}
              style={{ width: 96, height: 96 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-bold text-black tracking-tight">Webee</Text>
          <Text className="text-base text-gray-500 mt-1">수정벌 통합 관리 플랫폼</Text>
        </Animated.View>

        {/* 버튼 섹션 */}
        <Animated.View
          entering={FadeIn.delay(200).duration(500)}
          className="px-6 gap-3 mb-8"
        >
          <SocialButton
            icon={<Feather name="message-circle" size={20} color="#191600" />}
            label="카카오로 시작하기"
            bgColor="#FEE500"
            textColor="#191600"
            onPress={() => handleSocialLogin('카카오')}
          />

          {Platform.OS === 'ios' && (
            <SocialButton
              icon={<Feather name="smartphone" size={20} color="#FFFFFF" />}
              label="Apple로 계속하기"
              bgColor="#000000"
              textColor="#FFFFFF"
              onPress={() => handleSocialLogin('Apple')}
            />
          )}

          <SocialButton
            icon={<Feather name="mail" size={20} color="#000000" />}
            label="Google로 계속하기"
            bgColor="#FFFFFF"
            textColor="#000000"
            borderColor="#E5E5E5"
            onPress={() => handleSocialLogin('Google')}
          />

          {/* 구분선 */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-sm text-gray-400 mx-4">또는</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <Pressable onPress={() => setShowEmailLogin(true)} className="items-center py-3">
            <Text className="text-base text-blue-500 font-medium">
              아이디로 로그인
            </Text>
          </Pressable>

          <Pressable onPress={handleGoToRegister} className="items-center py-1">
            <Text className="text-sm text-gray-500">
              계정이 없으신가요? <Text className="text-blue-500 font-medium">회원가입</Text>
            </Text>
          </Pressable>
        </Animated.View>

        {/* 푸터 */}
        <Animated.View
          entering={FadeIn.delay(300).duration(500)}
          className="items-center px-8"
        >
          <Text className="text-sm text-gray-400 text-center leading-5">
            계속 진행하면 <Text className="text-gray-500 underline">서비스 이용약관</Text> 및{'\n'}
            <Text className="text-gray-500 underline">개인정보 처리방침</Text>에 동의하게 됩니다.
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
