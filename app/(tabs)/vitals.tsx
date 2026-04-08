import React from 'react';
import DashboardLayout from '@/components/dashboard/components/DashboardLayout';
import BodyVitals from '@/components/dashboard/sections/BodyVitals';
import { useAuth } from '@/hooks/useAuth';

export default function VitalsScreen() {
  const { user } = useAuth();
  const hasMedicalCondition: boolean = user?.hasMedicalCondition ?? false;

  return (
    <DashboardLayout>
      <BodyVitals hasMedicalCondition={hasMedicalCondition} />
    </DashboardLayout>
  );
}
