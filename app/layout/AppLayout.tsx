import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/widgets/header/ui/Header';
import { Footer } from '@/widgets/footer/ui/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <View className="flex-1">
        {children}
      </View>
      
      {/* Footer */}
      <Footer />
    </SafeAreaView>
  );
}