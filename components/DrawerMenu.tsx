import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = 280;

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: 'profile', icon: '👤', label: 'Profile', subtitle: 'View & edit your info' },
  { id: 'health', icon: '🩺', label: 'Health Profile', subtitle: 'Medical conditions & records' },
  { id: 'logout', icon: '🚪', label: 'Logout', subtitle: 'Sign out of your account' },
];

export default function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const userName: string =
    user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail: string = user?.email || '';

  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -DRAWER_WIDTH,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleItemPress = (id: string) => {
    onClose();
    // Navigate immediately (or in next tick) to avoid router context loss
    requestAnimationFrame(() => {
      if (id === 'profile') {
        router.push({ pathname: '/profile' } as any);
      } else if (id === 'health') {
        router.push({ pathname: '/profile', params: { section: 'health' } } as any);
      } else if (id === 'logout') {
        logout();
      }
    });
  };

  // Track if drawer has ever been opened so we don't render at all before first use
  const hasOpenedRef = useRef(false);
  if (isOpen) hasOpenedRef.current = true;
  if (!hasOpenedRef.current) return null;


  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Dark overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Drawer Panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        {/* Header - gradient */}
        <LinearGradient
          colors={['#7B4FD8', '#B06EF5', '#E040FB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.drawerHeader}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.headerName}>{userName}</Text>
          <Text style={styles.headerEmail}>{userEmail}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>✦ Premium Plan</Text>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.id === 'logout' && styles.menuItemLogout,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, item.id === 'logout' && styles.menuIconLogout]}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <View style={styles.menuTextBlock}>
                <Text style={[styles.menuLabel, item.id === 'logout' && styles.menuLabelLogout]}>
                  {item.label}
                </Text>
                <Text style={styles.menuSub}>{item.subtitle}</Text>
              </View>
              {item.id !== 'logout' && (
                <Text style={styles.menuArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.drawerFooter}>
          <Text style={styles.footerText}>Datalet Healthcare v1.0</Text>
          <Text style={styles.footerSub}>Your health, our priority ❤️</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: height,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 3,
  },
  headerEmail: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 12,
  },
  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  menuList: {
    paddingTop: 12,
    paddingHorizontal: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderRadius: 0,
    marginBottom: 0,
  },
  menuItemLogout: {
    marginTop: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F3F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconLogout: {
    backgroundColor: '#FEE2E2',
  },
  menuIconText: {
    fontSize: 18,
  },
  menuTextBlock: { flex: 1 },
  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  menuLabelLogout: {
    color: '#EF4444',
  },
  menuSub: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  menuArrow: {
    fontSize: 20,
    color: '#C4B5FD',
    fontWeight: '300',
  },
  drawerFooter: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  footerSub: {
    fontSize: 11,
    color: '#C4B5FD',
    marginTop: 3,
  },
});
