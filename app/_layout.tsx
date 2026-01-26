import { StatusBar, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter } from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import '../global.css';
import { Providers } from '@/providers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_EDGE_WIDTH = 30; // 스와이프 감지 영역 너비
const SWIPE_THRESHOLD = 80; // 뒤로가기 트리거 거리

export default function RootLayout() {
  const router = useRouter();
  const translateX = useSharedValue(0);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
    translateX.value = withTiming(0, { duration: 200 });
  };

  const resetPosition = () => {
    translateX.value = withTiming(0, { duration: 200 });
  };

  // 왼쪽 가장자리 스와이프 제스처
  const edgeSwipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, SCREEN_WIDTH * 0.4);
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(goBack)();
      } else {
        runOnJS(resetPosition)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {/* 메인 콘텐츠 */}
          <Animated.View style={[{ flex: 1, backgroundColor: '#fff' }, animatedStyle]}>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
              <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
              <Slot />
            </SafeAreaView>
          </Animated.View>

          {/* 왼쪽 가장자리 스와이프 감지 영역 */}
          <GestureDetector gesture={edgeSwipeGesture}>
            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: SWIPE_EDGE_WIDTH,
                backgroundColor: 'transparent',
              }}
            />
          </GestureDetector>
        </View>
      </Providers>
    </GestureHandlerRootView>
  );
}
