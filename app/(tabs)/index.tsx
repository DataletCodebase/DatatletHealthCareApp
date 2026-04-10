import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/components/DashboardLayout';
import TodayActivity from '@/components/dashboard/sections/TodayActivity';
import { permissionService } from '@/services/permissionService';

export default function TodayScreen() {
  useEffect(() => {
    // Proactively check and request missing permissions sequentially on first landing
    permissionService.requestMissingSequentially();
  }, []);

  return (
    <DashboardLayout>
      <TodayActivity />
    </DashboardLayout>
  );
}
