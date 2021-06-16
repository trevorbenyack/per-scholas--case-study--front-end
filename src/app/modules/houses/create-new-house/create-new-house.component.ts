import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import {Address} from "ngx-google-places-autocomplete/objects/address";
declare const Quill: any;
declare const Choices: any;

@Component({
  selector: 'app-create-new-house',
  templateUrl: './create-new-house.component.html',
  styleUrls: ['./create-new-house.component.css']
})
export class CreateNewHouseComponent implements OnInit {

  // Google Maps Api Options
  // Had to import Options directly, per advice at:
  // https://github.com/skynet2/ngx-google-places-autocomplete/issues/91
  formattedAddress = "";
  options={
    fields: ["address_components"],
    types: ["address"],
    componentRestrictions:{
      country: "US"
    }
  } as Options; // "as ..." tells TypeScript to type this object as the defined type instead of the default
  streetAddress01: string = "";
  streetAddress02: string = "";
  city: string = "";
  state: string = "";
  zipCode: string = "";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    if (document.getElementById('areas')) {
      var skills = document.getElementById('areas');
      const example = new Choices(skills, {
        delimiter: ',',
        editItems: true,
        maxItemCount: 10,
        removeItemButton: true,
        addItems: true
      });
    }
  } // end ngOnInit

  public handleAddressChange(address: Address) {
    this.streetAddress01 = "";
    console.log("inside handleAddressChange()");
    console.log(address.address_components);

    for(let address_component of address.address_components) {
      const componentType = address_component.types[0];
      switch (componentType) {
        case "street_number": {
          this.streetAddress01 += address_component.long_name
          break;
        }
        case "route": {
          this.streetAddress01 += " " + address_component.short_name;
          break;
        }
        case "locality": {
          this.city = address_component.long_name;
          break;
        }
        case "administrative_area_level_1": {
          this.state = address_component.short_name;
          break;
        }
        case "postal_code": {
          this.zipCode = address_component.long_name;
          break;
        }
      } // end switch statement
    } // end for-of loop
    const stAdd02Element = this.renderer.selectRootElement("#streetAddress02");
    stAdd02Element.focus();

  } // end handleAddressChange()

}
