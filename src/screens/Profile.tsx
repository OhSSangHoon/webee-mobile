import { useState } from 'react';
import { View, ScrollView, Pressable, Switch, FlatList, Dimensions } from 'react-native';
import Text from '@/components/Text';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFarmList } from '@/features/farm';
import { useSettingsStore } from '@/stores/useSettingsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32 - 32; // ScrollView padding

const getCultivationTypeLabel = (type: string) => {
  return type === 'CONTROLLED' ? '시설재배' : '노지재배';
};

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, rightElement, danger = false }: MenuItemProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-3 active:bg-gray-50"
    >
      <Feather
        name={icon}
        size={20}
        color={danger ? "#FF3B30" : "#8E8E93"}
        style={{ marginRight: 12 }}
      />
      <Text className={`flex-1 text-base ${danger ? 'text-red-500' : 'text-gray-900'}`}>
        {label}
      </Text>
      {rightElement || <Feather name="chevron-right" size={18} color="#C7C7CC" />}
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: farms = [], isLoading: farmsLoading } = useFarmList();
  const [newsNotificationEnabled, setNewsNotificationEnabled] = useState(false);
  const [communityNotificationEnabled, setCommunityNotificationEnabled] = useState(false);
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);
  const { fontOffset, increaseFontSize, decreaseFontSize } = useSettingsStore();
  const [currentFarmIndex, setCurrentFarmIndex] = useState(0);

  const onFarmScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setCurrentFarmIndex(index);
  };

  const userName = user?.fullName || user?.username || '사용자';

  const handleAddFarmland = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/add-farm');
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logout();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: 계정 삭제 확인 모달
    console.log('계정 삭제');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" showsVerticalScrollIndicator={false}>
      {/* 프로필 섹션 */}
      <View className="px-4 pt-4 mb-4">
        <Pressable className="flex-row items-center bg-white rounded-2xl p-4 active:scale-[0.98]">
          <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
            <Feather name="user" size={28} color="#8E8E93" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{userName}님</Text>
            <Text className="text-sm text-gray-600 mt-0.5">프로필 관리</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C7C7CC" />
        </Pressable>
      </View>

      {/* 내 농지 섹션 */}
      <View className="mb-4">
        <View className="px-5 mb-2">
          <Text className="text-xs font-semibold text-gray-600">내 농지</Text>
        </View>

        {farmsLoading ? (
          <View className="mx-4 bg-white rounded-2xl p-4 items-center">
            <Text className="text-sm text-gray-600">로딩중...</Text>
          </View>
        ) : farms.length === 0 ? (
          <Pressable
            onPress={handleAddFarmland}
            className="mx-4 bg-white rounded-2xl p-4 items-center justify-center active:scale-[0.98]"
            style={{ minHeight: 120 }}
          >
            <View className="w-11 h-11 rounded-xl bg-gray-100 items-center justify-center mb-2">
              <Feather name="plus" size={20} color="#6B7280" />
            </View>
            <Text className="text-base font-semibold text-gray-900">농지 추가</Text>
            <Text className="text-sm text-gray-600 mt-0.5">새 농지를 등록해보세요</Text>
          </Pressable>
        ) : (
          <>
            <FlatList
              data={[...farms, { id: '__add__' } as any]}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 12}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              onScroll={onFarmScroll}
              scrollEventThrottle={16}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                if (item.id === '__add__') {
                  return (
                    <Pressable
                      onPress={handleAddFarmland}
                      className="bg-white rounded-2xl p-4 items-center justify-center active:scale-[0.98]"
                      style={{ width: CARD_WIDTH, minHeight: 120 }}
                    >
                      <View className="w-11 h-11 rounded-xl bg-gray-100 items-center justify-center mb-2">
                        <Feather name="plus" size={20} color="#6B7280" />
                      </View>
                      <Text className="text-base font-semibold text-gray-900">농지 추가</Text>
                      <Text className="text-sm text-gray-600 mt-0.5">새 농지를 등록해보세요</Text>
                    </Pressable>
                  );
                }
                return (
                  <Pressable
                    className="bg-white rounded-2xl p-4 active:scale-[0.98]"
                    style={{ width: CARD_WIDTH }}
                  >
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center mr-3">
                        <Feather
                          name={item.cultivationType === 'CONTROLLED' ? 'home' : 'sun'}
                          size={18}
                          color="#3B82F6"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {item.name || '이름 없음'}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-0.5">
                          {item.cultivationAddress || '주소 미등록'}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={20} color="#C7C7CC" />
                    </View>
                    <View className="h-px bg-gray-100 my-3" />
                    <View className="flex-row">
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-600 mb-1">작물</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {item.name || '-'}
                        </Text>
                      </View>
                      <View className="w-px bg-gray-100" />
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-600 mb-1">시설</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {getCultivationTypeLabel(item.cultivationType)}
                        </Text>
                      </View>
                      <View className="w-px bg-gray-100" />
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-gray-600 mb-1">면적</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {item.cultivationArea}평
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
            <View className="flex-row justify-center mt-3 gap-1.5">
              {[...farms, null].map((_, index) => (
                <View
                  key={index}
                  className={`h-1.5 rounded-full ${index === currentFarmIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-400'}`}
                />
              ))}
            </View>
          </>
        )}
      </View>

      

      {/* 설정 섹션 */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-gray-600 mb-2 px-5">설정</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden">
          <MenuItem
            icon="bell"
            label="알림"
            onPress={() => setNotificationsExpanded(!notificationsExpanded)}
            rightElement={
              <Feather
                name={notificationsExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#C7C7CC"
              />
            }
          />
          {notificationsExpanded && (
            <>
              <View className="h-px bg-gray-100 ml-11" />
              <Pressable
                onPress={() => setNewsNotificationEnabled(!newsNotificationEnabled)}
                className="flex-row items-center pl-11 pr-4 py-3 active:bg-gray-50"
              >
                <Text className="flex-1 text-base text-gray-900">뉴스</Text>
                <Switch
                  value={newsNotificationEnabled}
                  onValueChange={setNewsNotificationEnabled}
                  trackColor={{ false: "#E5E5EA", true: "#F59E0B" }}
                  thumbColor="#FFFFFF"
                />
              </Pressable>
              <View className="h-px bg-gray-100 ml-11" />
              <Pressable
                onPress={() => setCommunityNotificationEnabled(!communityNotificationEnabled)}
                className="flex-row items-center pl-11 pr-4 py-3 active:bg-gray-50"
              >
                <Text className="flex-1 text-base text-gray-900">커뮤니티</Text>
                <Switch
                  value={communityNotificationEnabled}
                  onValueChange={setCommunityNotificationEnabled}
                  trackColor={{ false: "#E5E5EA", true: "#F59E0B" }}
                  thumbColor="#FFFFFF"
                />
              </Pressable>
            </>
          )}
          <View className="h-px bg-gray-100 ml-11" />
          <View className="flex-row items-center px-4 py-3">
            <Feather name="type" size={20} color="#8E8E93" style={{ marginRight: 12 }} />
            <Text className="flex-1 text-base text-gray-900">폰트 크기</Text>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={decreaseFontSize}
                disabled={fontOffset <= -2}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
              >
                <Feather name="minus" size={16} color={fontOffset <= -2 ? "#C7C7CC" : "#6B7280"} />
              </Pressable>
              <Pressable
                onPress={increaseFontSize}
                disabled={fontOffset >= 2}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
              >
                <Feather name="plus" size={16} color={fontOffset >= 2 ? "#C7C7CC" : "#6B7280"} />
              </Pressable>
            </View>
          </View>
          <View className="h-px bg-gray-100 ml-11" />
          <MenuItem icon="help-circle" label="문의하기" onPress={() => router.push('/bee-chat-inquiry')} />
          <View className="h-px bg-gray-100 ml-11" />
          <MenuItem icon="file-text" label="이용약관" onPress={() => {}} />
          <View className="h-px bg-gray-100 ml-11" />
          <MenuItem icon="shield" label="개인정보처리방침" onPress={() => {}} />
        </View>
      </View>

      {/* 계정 섹션 */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-gray-600 mb-2 px-5">계정</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden">
          <MenuItem icon="log-out" label="로그아웃" onPress={handleLogout} />
          <View className="h-px bg-gray-100 ml-11" />
          <MenuItem icon="trash-2" label="계정 삭제" onPress={handleDeleteAccount} danger />
        </View>
      </View>

      {/* 버전 정보 */}
      <View className="items-center py-4 mb-8">
        <Text className="text-sm text-gray-600">버전 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
