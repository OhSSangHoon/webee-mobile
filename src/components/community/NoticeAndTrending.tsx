import { View, Text, Pressable } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { PINNED_NOTICE, TRENDING_TAGS } from "@/constants/community";

export function PinnedNotice() {
  return (
    <View
      className="mx-5 mt-3 rounded-xl p-4 flex-row items-start"
      style={{
        backgroundColor: "#e8f3ff",
        borderWidth: 1,
        borderColor: "rgba(249,115,22,0.15)",
      }}
    >
      <View className="mr-3">
        <Svg width={36} height={36} viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="17"
            fill="#FFF3E0"
            stroke="#FFE0B2"
            strokeWidth="1"
          />
          <Path
            d="M18 8 L20 14 L27 14 L21 18 L23 24 L18 20 L13 24 L15 18 L9 14 L16 14 Z"
            fill="#FFC107"
          />
        </Svg>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1 mb-1">
          <Feather name="star" size={10} color="#f97316" />
          <Text
            className="text-[11px] font-semibold"
            style={{ color: "#f97316" }}
          >
            공지
          </Text>
        </View>
        <Text
          className="text-[14px] font-semibold leading-5"
          style={{ color: "#191f28" }}
          numberOfLines={2}
        >
          {PINNED_NOTICE.title}
        </Text>
        <Text className="text-xs mt-1" style={{ color: "#8b95a1" }}>
          {PINNED_NOTICE.author} · {PINNED_NOTICE.time}
        </Text>
      </View>
    </View>
  );
}

export function TrendingTags() {
  return (
    <View className="bg-white px-5 py-4 mb-2">
      <View className="flex-row items-center gap-1.5 mb-3">
        <Feather name="trending-up" size={15} color="#191f28" />
        <Text className="text-[15px] font-bold text-gray-900">
          지금 뜨는 주제
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {TRENDING_TAGS.map((tag, i) => (
          <View
            key={tag}
            className="flex-row items-center gap-1.5 rounded-full"
            style={{
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#e5e8eb",
              paddingHorizontal: 14,
              paddingVertical: 7,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
              elevation: 1,
            }}
          >
            <Text
              className="text-[11px] font-bold"
              style={{ color: "#f97316" }}
            >
              {i + 1}
            </Text>
            <Text
              className="text-[13px] font-medium"
              style={{ color: "#4e5968" }}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
