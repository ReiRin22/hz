'use client';

import { DeptInstructionScreen } from './components/organisms/DeptInstructionScreen';
import { labInstructionConfig } from './types/lab-instruction.config';

interface DEP002PageProps {
  onStatusUpdated?: (orderId: string, newStatus: string) => void;
}

export default function DEP002Page({ onStatusUpdated }: DEP002PageProps) {
  return (
    <DeptInstructionScreen config={labInstructionConfig} onStatusUpdated={onStatusUpdated} />
  );
}
