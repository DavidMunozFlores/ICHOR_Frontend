import { OrganPetitionResponse } from "./OrganPetitionResponse.interface";

export interface PatientResponse  {
  idPatient: number,
  internalID: string,
  name: string,
  identification: string,
  bloodType: string,
  height: number,
  weight: number,
  idHospital: number,
  organPetitions: OrganPetitionResponse[]
}
