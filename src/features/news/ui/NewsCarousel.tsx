import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { fetchGoogleNews } from "@/src/features/news/api/newsApi";
import type { NewsItem } from "@/src/features/news/model/types";

export const NewsCarousel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGoogleNews("수정벌");
        // 최대 5개의 뉴스만 가져오기
        setNews(data.slice(0, 5));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "뉴스를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleNewsClick = async (link: string) => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      }
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  if (loading) {
    return (
      <View className="w-full h-[110px] flex items-center justify-center bg-main-400/20 rounded-xl">
        <View className="flex flex-col items-center gap-2">
          <ActivityIndicator size="small" color="#FFB800" />
          <Text className="text-sm text-main-700">뉴스 로딩 중...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full h-[110px] flex items-center justify-center bg-red-50 rounded-xl">
        <Text className="text-sm text-red-600">{error}</Text>
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View className="w-full h-[110px] flex items-center justify-center bg-gray-50 rounded-xl">
        <Text className="text-sm text-gray-600">뉴스가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className="w-full relative mb-8">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        className="h-[110px]"
      >
        {news.map((item, index) => (
          <TouchableOpacity
            key={`${item.link}-${index}`}
            onPress={() => handleNewsClick(item.link)}
            className="w-[350px] mr-3"
          >
            <View className="w-full h-full border border-gray-400 rounded-xl p-4 flex flex-col justify-between">
              {/* 뉴스 제목 */}
              <View className="flex-1 overflow-hidden">
                <Text
                  className="text-lg font-semibold text-gray-900 leading-relaxed"
                  numberOfLines={3}
                >
                  {item.title}
                </Text>
              </View>

              {/* 하단 정보 */}
              <View className="flex flex-row items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <Text className="text-xs text-gray-700">
                  {new Date(item.pubDate).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text className="text-xs text-gray-700 font-medium">
                  자세히 보기 →
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
