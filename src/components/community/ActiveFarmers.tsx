import { View, Text, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ACTIVE_FARMERS } from "@/constants/community";

export function ActiveFarmers() {
  return (
    <View className="bg-white px-5 pt-4 pb-3 mb-2">
      <View className="flex-row items-center gap-1.5 mb-3">
        <Feather name="users" size={15} color="#191f28" />
        <Text className="text-[15px] font-bold text-gray-900">
          지금 활동 중인 농부
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          {ACTIVE_FARMERS.map((f) => (
            <Pressable key={f.id} className="items-center gap-1.5">
              <View className="relative">
                <View
                  className="w-[54px] h-[54px] rounded-full items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "#f2f4f6",
                    borderWidth: 2,
                    borderColor: f.active ? "#f97316" : "#e5e8eb",
                  }}
                >
                  <View
                    className="w-full h-full"
                    style={{ backgroundColor: f.color, opacity: 0.7 }}
                  />
                </View>
                {f.active && (
                  <View
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-[2px] border-white"
                    style={{ backgroundColor: "#03b26c" }}
                  />
                )}
              </View>
              <Text
                className="text-[11px] text-gray-700 max-w-[54px]"
                numberOfLines={1}
              >
                {f.name}
              </Text>
              <Text
                className="text-[10px] text-gray-400"
                style={{ marginTop: -4 }}
              >
                게시글 {f.postCount}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
