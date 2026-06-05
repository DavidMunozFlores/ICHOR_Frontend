import { hlaAllele, OrganPostResponse } from "../Coordinator/OrganPostResponse.interface"

export interface OrganPetitionResponse {
  idOrganPetition: number,
  idPatient: number,
  organType: string,
  weightGrams: number,
  volumeCC: number,
  hla: hlaAllele[],
  petitionState: string,
  organAssigned: OrganPostResponse | null
}
