import { LogInCredentials } from "../LogIn/LogInCredentials"
import { OrganPetitionID } from "./OrganPetitionID.interface"

export interface OrganPetitionAcceptPatch {

  authCredentials: LogInCredentials,
  data: OrganPetitionID

}
