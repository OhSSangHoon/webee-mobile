import { View, Text, Pressable } from 'react-native';

export function Header() {
  return (
    <View className="px-4 py-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center justify-between">
        {/* 로고 */}
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">🐝</Text>
          <Text className="text-xl font-bold text-gray-900">webee</Text>
        </View>
        
        {/* 알림 아이콘 */}
        <Pressable onPress={() => console.log('알림')}>
          <Text className="text-2xl">🔔</Text>
        </Pressable>
      </View>
    </View>
  );
}