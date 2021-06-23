import {House} from "./house";
import {prop, unique} from "@rxweb/reactive-form-validators";

export class Area {

  @prop() public areaId?: number
  @prop() public areaName: string = ""


}
