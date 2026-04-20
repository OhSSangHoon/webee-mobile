import { View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { PretendardFont } from "@/components/PretendardFont";

interface HiveData {
  id: string;
  name: string;
  status: "online" | "offline";
  temperature: number;
  humidity: number;
  lastUpdate: string;
}

interface ControlSetting {
  id: string;
  name: string;
  enabled: boolean;
}

interface HiveControlState {
  controls: ControlSetting[];
}

interface Props {
  hives: HiveData[];
  hiveControls: Record<string, HiveControlState>;
}

const mockHives = [
  {
    id: "1",
    name: "벌통 1호",
    status: "online" as const,
    temperature: 34.5,
    humidity: 62,
    lastUpdate: "2분 전",
  },
  {
    id: "2",
    name: "벌통 2호",
    status: "online" as const,
    temperature: 33.8,
    humidity: 58,
    lastUpdate: "5분 전",
  },
  {
    id: "3",
    name: "벌통 3호",
    status: "offline" as const,
    temperature: 0,
    humidity: 0,
    lastUpdate: "3시간 전",
  },
];

const mockHiveControls: Record<string, HiveControlState> = {
  "1": {
    controls: [
      { id: "ventilation", name: "자동환기", enabled: true },
      { id: "heating", name: "온도유지", enabled: false },
      { id: "humidity", name: "습도조절", enabled: true },
      { id: "alert", name: "알림", enabled: true },
    ],
  },
  "2": {
    controls: [
      { id: "ventilation", name: "자동환기", enabled: false },
      { id: "heating", name: "온도유지", enabled: true },
      { id: "humidity", name: "습도조절", enabled: false },
      { id: "alert", name: "알림", enabled: true },
    ],
  },
  "3": {
    controls: [
      { id: "ventilation", name: "자동환기", enabled: false },
      { id: "heating", name: "온도유지", enabled: false },
      { id: "humidity", name: "습도조절", enabled: false },
      { id: "alert", name: "알림", enabled: false },
    ],
  },
};

const AUTO_TAGS = ["ventilation", "heating", "humidity", "alert"] as const;
const TAG_LABEL: Record<string, string> = {
  ventilation: "자동환기",
  heating: "온도유지",
  humidity: "습도조절",
  alert: "알림",
};

function HiveCard({
  hive,
  controls,
}: {
  hive: HiveData;
  controls: ControlSetting[];
}) {
  const router = useRouter();
  const isOnline = hive.status === "online";
  const activeTags = controls.filter(
    (c) => AUTO_TAGS.includes(c.id as any) && c.enabled,
  );

  return (
    <View
      className="bg-white rounded-2xl p-4 mr-3 gap-3"
      style={{ width: 200 }}
    >
      {/* 상단: 이름 + 연결상태 */}
      <View className="flex-row items-center justify-between">
        <PretendardFont weight="semibold" className="text-sm text-gray-900">
          {hive.name}
        </PretendardFont>
        <View className="flex-row items-center gap-1">
          <View
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: isOnline ? "#22C55E" : "#D1D5DB" }}
          />
          <PretendardFont
            weight="regular"
            className="text-xs"
            style={{ color: isOnline ? "#22C55E" : "#9CA3AF" }}
          >
            {isOnline ? "연결됨" : "오프라인"}
          </PretendardFont>
        </View>
      </View>

      {/* 온도 + 습도 — 클릭 시 hive-stats */}
      <Pressable
        onPress={() => router.push("/hive-stats")}
        className="flex-row gap-2 active:opacity-70"
      >
        <View className="flex-1 bg-orange-50 rounded-xl p-2.5 items-center">
          <Feather name="thermometer" size={14} color="#F97316" />
          <PretendardFont
            weight="bold"
            className="text-base text-orange-500 mt-1"
          >
            {isOnline ? `${hive.temperature}°` : "-"}
          </PretendardFont>
          <PretendardFont
            weight="regular"
            className="text-[10px] text-gray-400"
          >
            내부온도
          </PretendardFont>
        </View>
        <View className="flex-1 bg-blue-50 rounded-xl p-2.5 items-center">
          <Feather name="droplet" size={14} color="#3B82F6" />
          <PretendardFont
            weight="bold"
            className="text-base text-blue-500 mt-1"
          >
            {isOnline ? `${hive.humidity}%` : "-"}
          </PretendardFont>
          <PretendardFont
            weight="regular"
            className="text-[10px] text-gray-400"
          >
            내부습도
          </PretendardFont>
        </View>
      </Pressable>

      {/* 자동 태그 — 클릭 시 hive-control */}
      <Pressable
        onPress={() => router.push("/hive-control")}
        className="active:opacity-70"
      >
        {activeTags.length > 0 ? (
          <View className="flex-row flex-wrap gap-1">
            {activeTags.map((c) => (
              <View
                key={c.id}
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: "#F3F4F6" }}
              >
                <PretendardFont
                  weight="medium"
                  className="text-[10px] text-gray-500"
                >
                  {TAG_LABEL[c.id]}
                </PretendardFont>
              </View>
            ))}
          </View>
        ) : (
          <PretendardFont
            weight="regular"
            className="text-[10px] text-gray-300"
          >
            자동 제어 없음
          </PretendardFont>
        )}
      </Pressable>

      {/* 업데이트 시각 */}
      <PretendardFont weight="regular" className="text-[10px] text-gray-300">
        {hive.lastUpdate} 업데이트
      </PretendardFont>
    </View>
  );
}

export function HiveControlBanner() {
  const router = useRouter();

  return (
    <View className="mb-6">
      {/* 섹션 헤더 */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <PretendardFont weight="semibold" className="text-base text-gray-900">
          내 벌통 현황
        </PretendardFont>
        <Pressable
          onPress={() => router.push("/hive-control")}
          className="flex-row items-center gap-0.5 active:opacity-70"
        >
          <PretendardFont weight="medium" className="text-xs text-gray-400">
            전체보기
          </PretendardFont>
          <Feather name="chevron-right" size={14} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* 가로 스크롤 카드 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {mockHives.map((hive) => (
          <HiveCard
            key={hive.id}
            hive={hive}
            controls={mockHiveControls[hive.id]?.controls ?? []}
          />
        ))}
      </ScrollView>
    </View>
  );
}
