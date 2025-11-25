import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Pages import
import { HomePage } from '@/pages/home/ui/Home';

const Tab = createBottomTabNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Navigator 헤더 숨김 (우리가 만든 Header 사용)
          tabBarActiveTintColor: '#F59E0B', // webee 메인 컬러
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomePage}
          options={{
            title: '홈',
            tabBarIcon: ({ focused, color }) => (
              <Text style={{ fontSize: 24 }}>
                {focused ? '🏠' : '🏡'}
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}