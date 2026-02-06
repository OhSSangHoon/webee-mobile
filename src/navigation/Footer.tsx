import { View, Pressable, Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface FooterTab {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  route: string;
}

const TABS: FooterTab[] = [
  { id: "bee-diagnosis", label: "진단", icon: "activity", route: "/bee-diagnosis" },
  { id: "recommend", label: "추천", icon: "thumbs-up", route: "/recommend" },
  { id: "home", label: "홈", icon: "home", route: "/home" },
  { id: "market", label: "장터", icon: "shopping-bag", route: "/market" },
  { id: "profile", label: "마이", icon: "user", route: "/profile" },
];

export default function Footer() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0] || "home";

  return (
    <View className="flex-row bg-white border-t border-gray-200 pb-2 pt-2 mb-1.5">
      {TABS.map((tab) => {
        const isActive = currentRoute === tab.route.replace("/", "");

        return (
          <Pressable
            key={tab.id}
            className="flex-1 items-center py-2"
            onPress={() => router.push(tab.route as any)}
          >
            <Feather
              name={tab.icon}
              size={22}
              color={isActive ? "#F59E0B" : "#9CA3AF"}
              className="mb-1"
            />
            <Text
              className={`text-xs mt-1 ${
                isActive ? "text-yellow-500 font-semibold" : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
