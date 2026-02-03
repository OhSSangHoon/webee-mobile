import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface HeaderProps {
  onMenuPress: () => void;
  onNotificationPress?: () => void;
}

export default function Header({ onMenuPress, onNotificationPress }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center px-3 py-2 bg-[#F5F5F7]">
      {/* 햄버거 메뉴 버튼 */}
      <Pressable className="p-1" onPress={onMenuPress}>
        <Feather name="menu" size={22} color="#000000" />
      </Pressable>

      {/* 알림 버튼 */}
      <Pressable className="p-1" onPress={onNotificationPress}>
        <Feather name="bell" size={22} color="#000000" />
      </Pressable>
    </View>
  );
}
