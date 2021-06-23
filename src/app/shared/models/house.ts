import {User} from "./user";
import {Area} from "./area";

import { required,prop,propObject,propArray } from "@rxweb/reactive-form-validators";

export class House {
  @prop() public houseId?: number;
  @required() public houseName: string = "";
  @required() public streetAddress01: string = "";
  @prop() public streetAddress02: string = "";
  @required() public city: string = "";
  @required() public state: string = "";
  @prop() public zipCode: string = "";
  @prop() public notes: string = "";
  @prop() public pictureUrl: string = "http://localhost:4200/assets/img/house-placeholder-image.png";
  @propArray() public areas: Area[] = [];
}
