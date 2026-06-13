import { Injectable } from "@nestjs/common";
import { axiosClient } from "@shared/plugins/bffAxiosClient";
import { UpstreamReceptionPatient } from "./types/reception-patients.type";

@Injectable()
export class ReceptionPatientsClient {
  async fetchReceptionPatients(date: string): Promise<UpstreamReceptionPatient[]> {
    const response = await axiosClient.get<{ patients: UpstreamReceptionPatient[] }>("/api/v1/reception-patients", {
      params: { date },
    });
    return response.data.patients;
  }
}
