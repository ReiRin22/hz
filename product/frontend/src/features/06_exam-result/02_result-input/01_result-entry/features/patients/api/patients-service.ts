import { Patient } from '../../../lib/types';
import { mockPatient } from '../../../lib/mock-data';

/**
 * Service layer for patient API calls
 */

export const patientsService = {
  /**
   * Get patient by ID
   */
  async getPatientById(patientId: string): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In production: return await fetch(`/api/patients/${patientId}`).then(r => r.json())
    return mockPatient;
  }
};
