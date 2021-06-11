import {House} from "./house";

export interface User {
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  houses: House[]
}
