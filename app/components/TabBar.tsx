import React from 'react';
import { View, StyleSheet } from 'react-native';
import HapticTab from '../../components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets(); 

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.title !== undefined ? options.title : route.name;

        let iconName: keyof typeof Ionicons.glyphMap = 'apps';
        if (route.name === 'mirror') iconName = 'phone-portrait-outline';
        if (route.name === 'ToolsScreen') iconName = 'construct-outline';
        if (route.name === 'CanvasScreen') iconName = 'brush-outline';
        if (route.name === 'Templates') iconName = 'albums-outline';
        if (route.name === 'LayerScreen') iconName = 'layers-outline';
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <HapticTab
            key={route.key}
            iconName={iconName}
            isFocused={isFocused}
            onPress={onPress}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 5, // Use padding instead of a fixed height
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});

export default TabBar; 