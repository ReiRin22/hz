import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mockDoctors, type Doctor } from '../data/mockDoctors';
import { getCurrentDoctorId, setCurrentDoctorId, initializeTestData } from '../utils/prescriptionStorage';

export function useDoctorManagement() {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

  // 初回ロード時に前回ログインしていた医師を復元
  useEffect(() => {
    const savedDoctorId = getCurrentDoctorId();
    if (savedDoctorId) {
      const doctor = mockDoctors.find(d => d.id === savedDoctorId);
      if (doctor) {
        setCurrentDoctor(doctor);
        // テストデータの初期化（初回のみ）
        initializeTestData(doctor.id);
      }
    }
  }, []);

  // 医師選択時の処理
  const handleDoctorChange = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setCurrentDoctorId(doctor.id);
    // テストデータの初期化（初回のみ）
    initializeTestData(doctor.id);
    toast.success(`${doctor.name}としてログインしました`);
  };

  return {
    currentDoctor,
    handleDoctorChange
  };
}
