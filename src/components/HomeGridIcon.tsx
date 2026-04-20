import { Image, Pressable, View } from "react-native";
import { PretendardFont } from "./PretendardFont";
import { useRouter } from "expo-router";
export function HomeGridIcon() {
  const router = useRouter();
  return (
    <View className="px-4 mb-6">
      <View className="flex-row flex-wrap">
        {[
          {
            id: "community",
            label: "농부의 수다",
            icon: require("../../assets/homeIcons/community.png"),
          },
          {
            id: "bee-diagnosis",
            label: "질병진단(꿀벌)",
            icon: require("../../assets/homeIcons/diagnosis.png"),
          },
          {
            id: "add-farm",
            label: "우리 농장",
            icon: require("../../assets/homeIcons/house.png"),
          },
          {
            id: "inquiry",
            label: "할 말 있어요",
            icon: require("../../assets/homeIcons/inquiry.png"),
          },
          {
            id: "news2",
            label: "벌통 관리",
            icon: require("../../assets/homeIcons/pesticide.png"),
          },
          {
            id: "bee-news",
            label: "키워드 뉴스",
            icon: require("../../assets/homeIcons/news2.png"),
          },
          {
            id: "recommend",
            label: "수정벌 추천",
            icon: require("../../assets/homeIcons/recommend.png"),
          },
          {
            id: "fruit-price",
            label: "농작물 시세",
            icon: require("../../assets/homeIcons/trading.png"),
          },
        ].map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/${item.id}` as any)}
            className="w-[25%] items-center py-4 active:opacity-70"
          >
            <Image
              source={item.icon}
              className="w-12 h-12 mb-2"
              resizeMode="contain"
            />
            <PretendardFont weight="medium" className="text-xs text-gray-600">
              {item.label}
            </PretendardFont>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
