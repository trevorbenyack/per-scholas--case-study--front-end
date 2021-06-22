import {House} from "./house";

export interface User {
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
  // _links: {
  //   self: {
  //     href: string
  //   },
  //   user: {
  //     href: string
  //   },
  //   houses: {
  //     href: string
  //   }
  // }
}
