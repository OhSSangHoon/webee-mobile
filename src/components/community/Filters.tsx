import { View, Text, ScrollView, Pressable } from "react-native";
import { CATEGORY_TABS, SORT_OPTIONS } from "@/constants/community";
import type { CategoryTab, SortKey } from "@/types/community";

interface CategoryTabsProps {
  active: CategoryTab;
  onChange: (key: CategoryTab) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <View className="bg-white border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <View className="flex-row" style={{ gap: 16 }}>
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.key === active;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onChange(tab.key)}
                style={{
                  paddingVertical: 14,
                  borderBottomWidth: 2,
                  borderBottomColor: isActive ? "#191f28" : "transparent",
                  marginBottom: -1,
                }}
              >
                <Text
                  className="text-sm whitespace-nowrap"
                  style={{
                    color: isActive ? "#191f28" : "#8b95a1",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

interface FilterChipsProps {
  active: SortKey;
  onChange: (key: SortKey) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <View className="bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          gap: 6,
        }}
      >
        {SORT_OPTIONS.map((opt) => {
          const isActive = opt.key === active;
          const isDisabled = opt.disabled;
          return (
            <Pressable
              key={opt.key}
              onPress={() => !isDisabled && onChange(opt.key)}
              disabled={isDisabled}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                backgroundColor: isActive ? "#191f28" : "#ffffff",
                borderColor: isActive ? "#191f28" : "#e5e8eb",
                opacity: isDisabled ? 0.4 : 1,
                marginRight: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#ffffff" : "#6b7684",
                }}
              >
                {opt.label}
                {isDisabled ? " 준비중" : ""}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
