import { LogInCredentials } from "../LogIn/LogInCredentials"
import { Organ } from "./Organ.interface"

interface OrganPost {
 authCredentials: LogInCredentials,
 data: Organ
}
