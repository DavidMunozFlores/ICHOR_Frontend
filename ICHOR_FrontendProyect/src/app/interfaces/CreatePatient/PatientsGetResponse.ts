export interface PatientGetResponse {
  idPatient: number;
  internalID: string;
  name: string;
  identification: string;
  bloodType: string;
  height: number;
  weight: number;
  idHospital: number;
  organPetitions: any[];
}

export interface PatientsApiResponse {
  data: PatientGetResponse[];
}
