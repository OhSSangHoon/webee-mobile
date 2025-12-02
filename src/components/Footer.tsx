import { Link, usePathname } from 'expo-router';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useChatbotStore } from '@/src/features/chatbot/model/useChatbotStore';
import { useUserStore } from '@/src/shared/auth/useUserStore';

const ICONS = {
  home: require('@/assets/navigation/home.webp'),
  home_hover: require('@/assets/navigation/home_hover.webp'),
  chat: require('@/assets/navigation/chat.webp'),
  chat_hover: require('@/assets/navigation/chat_hover.webp'),
  profile: require('@/assets/navigation/profile.webp'),
  profile_hover: require('@/assets/navigation/profile_hover.webp'),
};

export default function Footer() {
  const pathname = usePathname();
  const { isLoggedIn } = useUserStore();
  const { openChatbot } = useChatbotStore();
  const [pressedIcon, setPressedIcon] = useState<string | null>(null);

  const tabs = [
    { name: 'home', title: '홈', href: '/', icon: ICONS.home, iconHover: ICONS.home_hover },
    { name: 'search', title: '거래', href: '/search', icon: ICONS.chat, iconHover: ICONS.chat_hover },
    { name: 'chat', title: '상담', href: '/chat', icon: ICONS.chat, iconHover: ICONS.chat_hover, onPress: openChatbot },
    { name: 'profile', title: isLoggedIn ? '프로필' : '로그인', href: '/profile', icon: ICONS.profile, iconHover: ICONS.profile_hover },
  ];

  return (
    <View className="w-full h-[95px] flex-row items-center py-3 mt-auto bg-white shadow-[0_-2px_6px_0_rgba(0,0,0,0.06)] rounded-t-3xl">
      {tabs.map((tab) => {
        const isFocused = pathname === tab.href;
        const isPressed = pressedIcon === tab.name;
        const isActive = isFocused || isPressed;

        if (tab.onPress) {
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={(e) => {
                e.preventDefault();
                tab.onPress();
              }}
              onPressIn={() => setPressedIcon(tab.name)}
              onPressOut={() => setPressedIcon(null)}
              className="cursor-pointer flex flex-col items-center justify-center gap-2 flex-1"
            >
              <View className="relative w-[25px] h-[25px]">
                <Image
                  source={tab.icon}
                  className={`w-[25px] h-[25px] absolute ${isActive ? 'opacity-0' : 'opacity-100'}`}
                />
                <Image
                  source={tab.iconHover}
                  className={`w-[25px] h-[25px] absolute ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
              </View>
              <Text className={`text-xs font-medium ${isActive ? 'text-main-300' : 'text-gray-700'}`}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <Link
            key={tab.name}
            href={tab.href}
            onPressIn={() => setPressedIcon(tab.name)}
            onPressOut={() => setPressedIcon(null)}
            asChild
          >
            <TouchableOpacity className="cursor-pointer flex flex-col items-center justify-center gap-2 flex-1">
              <View className="relative w-[25px] h-[25px]">
                <Image
                  source={tab.icon}
                  className={`w-[25px] h-[25px] absolute ${isActive ? 'opacity-0' : 'opacity-100'}`}
                />
                <Image
                  source={tab.iconHover}
                  className={`w-[25px] h-[25px] absolute ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
              </View>
              <Text className={`text-xs font-medium ${isActive ? 'text-main-300' : 'text-gray-700'}`}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}
