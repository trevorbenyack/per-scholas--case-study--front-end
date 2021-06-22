import {House} from "./house";
import {prop, unique} from "@rxweb/reactive-form-validators";

export class Area {

  @prop() public areaId?: number;
  @unique() public areaName: string = "";
}
