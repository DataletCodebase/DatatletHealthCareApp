import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanCardProps {
  title: string;
  price: string;
  period?: string;
  features: PlanFeature[];
  isActive: boolean;
  onSelect: () => void;
  badge?: string;
}

export default function PlanCard({
  title,
  price,
  period,
  features,
  isActive,
  onSelect,
  badge,
}: PlanCardProps) {
  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      {isActive && (
        <View style={styles.activeBadge}>
          <LinearGradient
            colors={['#7B4FD8', '#E040FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.activeBadgeGradient}
          >
            <Text style={styles.activeBadgeText}>✦ Current Plan</Text>
          </LinearGradient>
        </View>
      )}
      {badge && !isActive && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>{badge}</Text>
        </View>
      )}

      <Text style={[styles.planTitle, isActive && styles.planTitleActive]}>{title}</Text>

      <View style={styles.priceRow}>
        <Text style={[styles.price, isActive && styles.priceActive]}>{price}</Text>
        {period && <Text style={styles.period}>{period}</Text>}
      </View>

      <View style={styles.featureList}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <Text style={[styles.featureCheck, f.included ? styles.checkOn : styles.checkOff]}>
              {f.included ? '✓' : '✕'}
            </Text>
            <Text style={[styles.featureText, !f.included && styles.featureTextOff]}>
              {f.text}
            </Text>
          </View>
        ))}
      </View>

      {isActive ? (
        <View style={styles.activeIndicator}>
          <Text style={styles.activeIndicatorText}>✓ Active</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onSelect} activeOpacity={0.85} style={styles.selectBtn}>
          <LinearGradient
            colors={['#7B4FD8', '#E040FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.selectBtnGradient}
          >
            <Text style={styles.selectBtnText}>Upgrade to {title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: '#7B4FD8',
    backgroundColor: '#FAF8FF',
    shadowColor: '#7B4FD8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  activeBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  activeBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3CD',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  popularText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '700',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
    marginTop: 4,
  },
  planTitleActive: {
    color: '#7B4FD8',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  priceActive: {
    color: '#7B4FD8',
  },
  period: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    marginBottom: 3,
  },
  featureList: {
    marginBottom: 16,
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureCheck: {
    fontSize: 13,
    fontWeight: '800',
    width: 16,
    textAlign: 'center',
  },
  checkOn: { color: '#10B981' },
  checkOff: { color: '#D1D5DB' },
  featureText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  featureTextOff: {
    color: '#9CA3AF',
  },
  activeIndicator: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  activeIndicatorText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 13,
  },
  selectBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectBtnGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
