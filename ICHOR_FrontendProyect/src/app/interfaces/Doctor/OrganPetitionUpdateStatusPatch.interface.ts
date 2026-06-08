import { LogInCredentials } from "../LogIn/LogInCredentials"
import { OrganPetitionID } from "./OrganPetitionID.interface"

export interface OrganPetitionUpdateStatusPatch {

  authCredentials: LogInCredentials,
  data: OrganPetitionID

}
