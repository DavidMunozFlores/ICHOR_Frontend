import { IOrganPetition } from "./IOrganPetition.interface";

export interface OrganPetitionUpdate {
  idOrganPetition: number,
  idPatient: number,
  organType: string,
  weightGrams: number,
  volumeCC: number,
  hla: string
}
