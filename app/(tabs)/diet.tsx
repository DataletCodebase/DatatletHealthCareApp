import React from 'react';
import DashboardLayout from '@/components/dashboard/components/DashboardLayout';
import Diet from '@/components/dashboard/sections/Diet';

export default function DietScreen() {
  return (
    <DashboardLayout>
      <Diet />
    </DashboardLayout>
  );
}
