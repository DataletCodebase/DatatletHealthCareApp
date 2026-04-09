import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TAB_BAR_MARGIN = 20;
const TAB_BAR_WIDTH = width - (TAB_BAR_MARGIN * 2);
const TAB_BAR_HEIGHT = 60;
const ACTIVE_PILL_HEIGHT = 46;
const TAB_INNER_PADDING = 20; // Padding to prevent items from touching the edges

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 1,
};

const ANIMATION_CONFIG = {
  duration: 300,
  easing: Easing.inOut(Easing.quad),
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useSharedValue(0);
  const totalAvailableWidth = TAB_BAR_WIDTH - (TAB_INNER_PADDING * 2);
  const tabWidth = totalAvailableWidth / state.routes.length;
  const pillWidth = tabWidth * 1.35;

  useEffect(() => {
    // Precise center calculation relative to the absolute parent
    const iconCenter = TAB_INNER_PADDING + (state.index * tabWidth) + (tabWidth / 2);
    const targetX = iconCenter - (pillWidth / 2);

    // Strict clamping within the bar's borders
    const minX = 4;
    const maxX = TAB_BAR_WIDTH - pillWidth - 4;
    const clampedX = Math.max(minX, Math.min(targetX, maxX));

    translateX.value = withSpring(clampedX, SPRING_CONFIG);
  }, [state.index, tabWidth, pillWidth]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Respect tabBarStyle: { display: 'none' } from screen options
  const { options } = descriptors[state.routes[state.index].key];
  const tabBarStyle = StyleSheet.flatten(options.tabBarStyle) as any;
  if (tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBarPill}>
        {/* Absolute Sliding Background */}
        <Animated.View style={[styles.activePillContainer, { width: pillWidth }, animatedPillStyle]}>
          <LinearGradient
            colors={['#7B00CC', '#CC00FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activePillGradient}
          />
        </Animated.View>

        {/* Deterministic Spacers for edge tabs */}
        <View style={{ width: TAB_INNER_PADDING }} />
        
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              <TabItemContent isFocused={isFocused} options={options} route={route} />
            </Pressable>
          );
        })}

        <View style={{ width: TAB_INNER_PADDING }} />
      </View>
    </View>
  );
}

function TabItemContent({ isFocused, options, route }: any) {
  const scale = useSharedValue(isFocused ? 1.08 : 0.96);
  const emphasis = useSharedValue(isFocused ? 1 : 0.65);
  const labelOpacity = useSharedValue(isFocused ? 1 : 0);
  const labelExpand = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1.08 : 0.96, ANIMATION_CONFIG);
    emphasis.value = withTiming(isFocused ? 1 : 0.65, ANIMATION_CONFIG);
    labelOpacity.value = withTiming(isFocused ? 1 : 0, ANIMATION_CONFIG);
    labelExpand.value = withTiming(isFocused ? 1 : 0, ANIMATION_CONFIG);
  }, [isFocused]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: emphasis.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    maxWidth: interpolate(labelExpand.value, [0, 1], [0, 80]), // Use maxWidth to avoid extra empty space
    transform: [{ translateX: interpolate(labelOpacity.value, [0, 1], [10, 0]) }],
  }));

  const label = options.title || route.name;
  const iconName = (() => {
    switch (route.name) {
      case 'index': return 'today.fill';
      case 'sleep': return 'bed.double.fill';
      case 'vitals': return 'heart.fill';
      case 'diet': return 'leaf.fill';
      default: return 'house.fill';
    }
  })();

  return (
    <Animated.View style={[styles.tabContent, animatedContainerStyle]}>
      <IconSymbol name={iconName} size={22} color={isFocused ? '#FFFFFF' : '#1A1C1E'} />
      <Animated.View style={[styles.labelContainer, animatedTextStyle]}>
        <Text style={styles.tabLabel} numberOfLines={1}>{label}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20, // Moved down from 30
    width: width,
    alignItems: 'center',
    paddingHorizontal: TAB_BAR_MARGIN,
    backgroundColor: 'transparent',
  },
  tabBarPill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: TAB_BAR_HEIGHT,
    width: TAB_BAR_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'visible',
  },
  activePillContainer: {
    position: 'absolute',
    height: ACTIVE_PILL_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 0,
  },
  activePillGradient: {
    flex: 1,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ACTIVE_PILL_HEIGHT,
  },
  labelContainer: {
    marginLeft: 6,
    overflow: 'hidden',
  },
  tabLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 2,
  },
});
