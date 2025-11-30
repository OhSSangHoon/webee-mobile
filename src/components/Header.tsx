import { View, Pressable, Image } from 'react-native';
import { useState } from 'react';
import HeaderMenu from './HeaderMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <View className="w-full bg-white h-[100px] ">
        <View className="px-4 flex-row items-center justify-center h-full mx-auto w-full relative">
          {/* 로고 */}
          <Pressable
            onPress={() => console.log('Navigate to home')}
            className="items-center justify-center"
          >
            <Image
              alt="Webee Logo"
              className="w-32 h-auto"
              source={require('@/assets/branding/webee.png')}
              resizeMode="contain"
            />
          </Pressable>

          {/* 햄버거 메뉴 버튼 */}
          <Pressable
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute right-4 p-2 rounded-lg active:bg-gray-100"
          >
            <View className="w-6 h-6 items-center justify-center">
              {isMenuOpen ? (
                // X 아이콘
                <View className="relative w-6 h-6 items-center justify-center">
                  <View className="absolute w-6 h-0.5 bg-black rotate-45" />
                  <View className="absolute w-6 h-0.5 bg-black -rotate-45" />
                </View>
              ) : (
                // 햄버거 아이콘
                <View className="gap-1">
                  <View className="w-6 h-0.5 bg-black" />
                  <View className="w-6 h-0.5 bg-black" />
                  <View className="w-6 h-0.5 bg-black" />
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      {/* 드롭다운 메뉴 */}
      <HeaderMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
