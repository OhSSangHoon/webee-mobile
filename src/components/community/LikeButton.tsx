import { useRef } from "react";
import { Pressable, Text, Animated, Easing, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

export function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    onToggle();

    // bounce
    scale.setValue(0.7);
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 180,
      useNativeDriver: true,
    }).start();

    // liked 되는 경우만 파티클은 부모 state 기준으로 판단해야 정확
    if (!liked) {
      particleAnim.setValue(0);
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  };

  const particleTranslateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });
  const particleOpacity = particleAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Pressable onPress={handlePress} className="flex-row items-center gap-1">
      <View>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather
            name="heart"
            size={16}
            color={liked ? "#f04452" : "#8b95a1"}
          />
        </Animated.View>

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