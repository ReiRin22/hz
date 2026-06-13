import { useState, useCallback } from 'react';
import type { ImplantDeviceData, PacemakerRecord, AneurysmClipRecord, MetalImplantRecord } from '../types/patientInfo.type';

export function useImplantDevice(initial: ImplantDeviceData) {
  const [data, setData] = useState<ImplantDeviceData>(initial);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'pacemaker' | 'aneurysmClip' | 'metalImplant'; id: string } | null>(null);

  const deletePacemaker = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      pacemakers: prev.pacemakers.filter((r) => r.id !== id),
    }));
  }, []);

  const deleteAneurysmClip = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      aneurysmClips: prev.aneurysmClips.filter((r) => r.id !== id),
    }));
  }, []);

  const deleteMetalImplant = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      metalImplants: prev.metalImplants.filter((r) => r.id !== id),
    }));
  }, []);

  const addPacemaker = useCallback((record: PacemakerRecord) => {
    setData((prev) => ({ ...prev, pacemakers: [...prev.pacemakers, record] }));
  }, []);

  const addAneurysmClip = useCallback((record: AneurysmClipRecord) => {
    setData((prev) => ({ ...prev, aneurysmClips: [...prev.aneurysmClips, record] }));
  }, []);

  const addMetalImplant = useCallback((record: MetalImplantRecord) => {
    setData((prev) => ({ ...prev, metalImplants: [...prev.metalImplants, record] }));
  }, []);

  return {
    data,
    deleteTarget,
    setDeleteTarget,
    deletePacemaker,
    deleteAneurysmClip,
    deleteMetalImplant,
    addPacemaker,
    addAneurysmClip,
    addMetalImplant,
  };
}
