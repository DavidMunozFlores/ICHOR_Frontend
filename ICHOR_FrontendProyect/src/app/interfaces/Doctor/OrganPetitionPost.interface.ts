import { LogInCredentials } from '../LogIn/LogInCredentials';
import { IOrganPetition } from './IOrganPetition.interface';

export interface OrganPetitionPost {
  authCredentials: LogInCredentials,
  data: IOrganPetition
}
