import React from 'react';
import DashboardLayout from '@/components/dashboard/components/DashboardLayout';
import SleepWellness from '@/components/dashboard/sections/SleepWellness';

export default function SleepScreen() {
  return (
    <DashboardLayout>
      <SleepWellness />
    </DashboardLayout>
  );
}
