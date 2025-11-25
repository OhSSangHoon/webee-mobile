import { View, Text } from 'react-native';

export function Footer() {
  return (
    <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <Text className="text-xs text-gray-500 text-center">
        © 2024 webee. 수정벌 전문 플랫폼
      </Text>
      <Text className="text-xs text-gray-400 text-center mt-1">
        문의: support@webee.com
      </Text>
    </View>
  );
}