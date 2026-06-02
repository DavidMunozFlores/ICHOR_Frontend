import { Organ } from "../Coordinator/Organ.interface"
import { hlaAllele, OrganPostResponse } from "../Coordinator/OrganPostResponse.interface"

export interface petitionGetResponse {
  idPatient: number,
  organType: string,
  weightGrams: number,
  volumeCC: number,
  hla: hlaAllele[],
  petitionState: string,
  organAssigned: OrganPostResponse | null
  status: string
}
