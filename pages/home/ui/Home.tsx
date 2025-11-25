import { View, Text } from 'react-native';
import { AppLayout } from '@/app/layout/AppLayout';

export function HomePage() {
  return (
    <AppLayout>
        <View className="flex-1 items-center justify-center ">
          <Text>Home</Text>
        </View>
    </AppLayout>
  );
}