import { useState, useRef, useEffect } from "react";
import { Pressable, Text, Animated, Easing, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LikeButtonProps {
  initialCount: number;
  initialLiked?: boolean;
}

/**
 * LikeButton (uncontrolled + prop sync)
 *
 * - 외부 사용 방식(<LikeButton initialCount=... />)을 유지하기 위해 내부 state를 사용하는 uncontrolled 컴포넌트 형태를 유지
 *
 * 문제:
 * - useState(initialX)는 "마운트 시점 값"만 반영되므로
 *   이후 부모에서 값이 변경(refetch 등)되어도 UI가 갱신되지 않는 stale state 문제가 발생한다.
 *
 * 해결:
 * - useEffect로 prop 변경을 감지하여 내부 state를 강제로 동기화한다. (derived state 보정 패턴)
 *
 * 주의:
 * - 로컬 토글 직후 외부 값이 들어오면 state가 덮어써질 수 있음
 *   (완전한 해결은 controlled 컴포넌트로 전환 필요)
 */
export function LikeButton({
  initialCount,
  initialLiked = false,
}: LikeButtonProps) {
  // 내부 상태 (uncontrolled)
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  /**
   * 🔥 핵심: props → state 동기화
   *
   * 부모에서 likeCount / liked 값이 바뀌는 경우(refetch, 다른 유저 액션 등)
   * 기존 useState 값은 자동 갱신되지 않기 때문에 수동으로 맞춰준다.
   */
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  // 애니메이션 값
  const scale = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  /**
   * 좋아요 토글 핸들러
   * - 로컬 상태 즉시 반영 (optimistic UI)
   * - 하트 bounce 애니메이션
   * - 좋아요 시 파티클 효과
   */
  const toggle = () => {
    const next = !liked;

    // 로컬 상태 업데이트
    setLiked(next);
    setCount((c) => (next ? c + 1 : c - 1));

    // 하트 bounce (scale 애니메이션)
    scale.setValue(0.7);
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 180,
      useNativeDriver: true,
    }).start();

    // 좋아요 상태로 바뀔 때만 파티클 실행
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

  // 파티클 위치 / 투명도 보간
  const particleTranslateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const particleOpacity = particleAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Pressable onPress={toggle} className="flex-row items-center gap-1">
      <View>
        {/* 하트 아이콘 + scale 애니메이션 */}
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"} // 상태에 따른 아이콘 변경
            size={16}
            color={liked ? "#f04452" : "#8b95a1"}
          />
        </Animated.View>

        {/* 파티클 (작은 하트가 위로 튀어오름) */}
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
          <Ionicons name="heart" size={10} color="#f04452" />
        </Animated.View>
      </View>

      {/* 좋아요 수 */}
      <Text
        className="text-xs font-medium"
        style={{ color: liked ? "#f04452" : "#8b95a1" }}
      >
        {count}
      </Text>
    </Pressable>
  );
}
