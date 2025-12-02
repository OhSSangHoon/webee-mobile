import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: '❤️', label: '수정벌추천', link: '/recommend' },
  { icon: '🩺', label: '질병진단', link: '/diagnosis' },
  { icon: '📰', label: '수정벌뉴스', link: '/news' },
  { icon: '🐛', label: '농약정보', link: '/pesticide' },
];

export default function HeaderMenu({ isOpen, onClose }: HeaderMenuProps) {
  const handleItemClick = (link: string) => {
    console.log('Navigate to:', link);
    // TODO: React Navigation으로 이동
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 오버레이 */}
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center"
        onPress={onClose}
      >
        {/* 드롭다운 메뉴 */}
        <View className="absolute w-[95%] top-[150px] bg-white/95 rounded-xl shadow-2xl border border-gray-200">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => handleItemClick(item.link)}
              className={`flex-row items-center gap-3 py-4 px-4 active:bg-yellow-50 ${
                index < MENU_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <Text className="text-xl">{item.icon}</Text>
              <Text className="text-base font-medium text-gray-800">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
