import { LogInCredentials } from "../LogIn/LogInCredentials";
import { OrganPetitionUpdate } from "./OrganPetitionUpdate.interface";

export interface OrganPetitionUpdatePost {
  authCredentials: LogInCredentials,
  data: OrganPetitionUpdate
}
