import { useState, useRef } from "react";
import { Pressable, Text, Animated, Easing, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface LikeButtonProps {
  initialCount: number;
  initialLiked?: boolean;
}

/**
 * 좋아요 토글 버튼 (API 미구현 — UI 애니메이션만)
 *
 * Lottie 대신 Animated로 구현:
 * - 하트 scale bounce (spring)
 * - 숫자 fade-in
 * - 클릭 시 입자 효과(작은 하트 3개 위로 튀어오름)
 */
export function LikeButton({ initialCount, initialLiked = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const scale = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => (next ? c + 1 : c - 1));

    // 하트 bounce
    scale.setValue(0.7);
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 180,
      useNativeDriver: true,
    }).start();

    // 좋아요 시에만 파티클
    if (next) {
      particleAnim.setValue(0);
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  };

  const particleTranslateY = particleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const particleOpacity = particleAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 1, 0] });

  return (
    <Pressable onPress={toggle} className="flex-row items-center gap-1">
      <View>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather
            name="heart"
            size={16}
            color={liked ? "#f04452" : "#8b95a1"}
            fill={liked ? "#f04452" : "none" as any}
          />
        </Animated.View>
        {/* 파티클 */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 2,
            top: 0,
            opacity: particleOpacity,
            transform: [{ translateY: particleTranslateY }],
          }}
        >
          <Feather name="heart" size={10} color="#f04452" />
        </Animated.View>
      </View>
      <Text
        className="text-xs font-medium"
        style={{ color: liked ? "#f04452" : "#8b95a1" }}
      >
        {count}
      </Text>
    </Pressable>
  );
}