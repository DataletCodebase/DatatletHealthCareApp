import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PlanCard from '../PlanCard';
import SectionCard from '../SectionCard';

const PLANS = [
  {
    id: 'basic',
    title: 'Basic',
    price: 'Free',
    period: '',
    badge: '',
    features: [
      { text: 'Health dashboard', included: true },
      { text: 'Basic vitals tracking', included: true },
      { text: 'AI health tips', included: false },
      { text: 'Medical records upload', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '₹299',
    period: '/month',
    badge: '⭐ Popular',
    features: [
      { text: 'Health dashboard', included: true },
      { text: 'Advanced vitals tracking', included: true },
      { text: 'AI health tips', included: true },
      { text: 'Medical records upload', included: true },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    title: 'Premium',
    price: '₹599',
    period: '/month',
    badge: '🔥 Best Value',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited AI queries', included: true },
      { text: 'Dedicated dietician', included: true },
      { text: 'Medical records upload', included: true },
      { text: 'Priority support', included: true },
    ],
  },
];

interface ChangePlanProps {
  currentPlan?: string;
}

export default function ChangePlan({ currentPlan = 'premium' }: ChangePlanProps) {
  const [activePlan, setActivePlan] = useState(currentPlan);

  return (
    <SectionCard title="Subscription Plan" icon="💎">
      <Text style={styles.subtitle}>
        Choose the plan that best fits your health journey.
      </Text>
      {PLANS.map((plan) => (
        <PlanCard
          key={plan.id}
          title={plan.title}
          price={plan.price}
          period={plan.period}
          features={plan.features}
          isActive={activePlan === plan.id}
          badge={plan.badge}
          onSelect={() => setActivePlan(plan.id)}
        />
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 14,
    lineHeight: 18,
  },
});
