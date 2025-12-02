import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import '../global.css';

export default function RootLayout() {
  return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
        <Header />
        <View className="flex-1 py-4">
          <Slot />
        </View>
        <Footer />
      </SafeAreaView>
  );
}
