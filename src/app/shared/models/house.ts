import {User} from "./user";
import {Area} from "./area";

export interface House {
  houseId: number,
  streetAddress01: string,
  streetAddress02: string,
  city: string,
  state: string,
  zipCode: string,
  notes: string,
  pictureUrl: string,
  areas: Area[],
  users: User[]
}
