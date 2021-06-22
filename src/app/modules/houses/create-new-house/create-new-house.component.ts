import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Options} from 'ngx-google-places-autocomplete/objects/options/options';
import {Address} from "ngx-google-places-autocomplete/objects/address";
// import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {House} from '../../../shared/models/house'
import {ImageService} from "../../../shared/services/image.service";
import {FileUploadService} from "../../../shared/services/file-upload.service";
import {ImageFileObject} from "../../../shared/models/image-file-object";

import {HouseInfoService} from "../../../shared/services/house-info.service";
import {AreasService} from "../../../shared/services/areas.service";
import {Area} from "../../../shared/models/area";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {FormArray, FormGroup} from "@angular/forms";

declare const Choices: any;

@Component({
  selector: 'app-create-new-house',
  templateUrl: './create-new-house.component.html',
  styleUrls: ['./create-new-house.component.css']
})
export class CreateNewHouseComponent implements OnInit {
  // form object
  houseInfoFormGroup: FormGroup;

  // used for getting areas field values from form
  choicesObj: typeof Choices;

  // holds the url from the server response for picture upload
  pictureUrl: string = "";

  // image upload properties
  profileImageUploadUrl: string = "http://localhost:8080/api/users/photos/uploadImage";
  imageUploadObj = {} as ImageFileObject;
  imageError: string = "";

  // Google Maps Api Options
  // Had to import Options directly, per advice at:
  // https://github.com/skynet2/ngx-google-places-autocomplete/issues/91
  formattedAddress = "";
  options = {
    fields: ["address_components"],
    types: ["address"],
    componentRestrictions: {
      country: "US"
    }
  } as Options; // "as ..." tells TypeScript to type this object as the defined type instead of the default

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private rxFormBuilder: RxFormBuilder,
              private imageService: ImageService,
              private fileUploadService: FileUploadService,
              private houseInfoService: HouseInfoService,
              private areasService: AreasService) {

    this.houseInfoFormGroup = this.rxFormBuilder.formGroup(House);
  }

  ngOnInit(): void {

    // listener for Choices events
    this.renderer.listen(
      document,
      'addItem',
      (event) => {
        this.saveArea(event.detail.value);
        console.log(`Choices listener working. Event is: ${event.detail.value}`);
      });

    // initializes the "Areas" Choices plugin
    if (document.getElementById('areas')) {
      const areas = document.getElementById('areas');
      this.choicesObj = new Choices(areas, {
        delimiter: ',',
        editItems: true,
        maxItemCount: 10,
        removeItemButton: true,
        addItems: true
      });
    }
  } // end ngOnInit

  // saves area to server when user enters new area
  saveArea(areaName: string) {
    console.debug("savedAreas() called");

    const areaToSave = {} as Area;

    // holds area objects returned from server when saved
    let areas = <FormArray>this.houseInfoFormGroup.controls.areas;

    // package area name in area object to send to back end
    areaToSave.areaName = areaName;

    this.areasService.saveAreaToServer(areaToSave).subscribe({
      next: response => {
        areaToSave.areaId = response.areaId;
        areas.push(this.rxFormBuilder.formGroup(Area, areaToSave));
        console.debug("response is: ");
        console.debug(response);
        console.debug("areas Array is:")
        //areas.forEach(a => console.debug(a))
        console.log(areas.getRawValue());
      },
      error: err => {
        console.warn("Area could not be saved to server.")
      }
    });
  }

  // auto-populates address fields from Google Maps Places API
  public handleAddressChange(address: Address) {

    let street_number: string = "";

    for (let address_component of address.address_components) {
      const componentType = address_component.types[0];
      switch (componentType) {
        case "street_number": {
          street_number = address_component.long_name;
          break;
        }
        case "route": {
          this.houseInfoFormGroup.controls.streetAddress01.setValue(`${street_number} ${address_component.short_name}`);
          break;
        }
        case "locality": {
          this.houseInfoFormGroup.controls.city.setValue(address_component.long_name);
          break;
        }
        case "administrative_area_level_1": {
          this.houseInfoFormGroup.controls.state.setValue(address_component.short_name);
          break;
        }
        case "postal_code": {
          this.houseInfoFormGroup.controls.zipCode.setValue(address_component.long_name);
          break;
        }
      } // end switch statement
    } // end for-of loop
    const stAdd02Element = this.renderer.selectRootElement("#streetAddress02");
    stAdd02Element.focus();

  } // end handleAddressChange()


  onSubmit(): void {
    console.debug('populating a new house object');

    // if there are invalid values in the fields, mark all the fields as touched
    // (will show alerts for all invalid fields) and then exit the function
    // i.e. don't do anything...
    if (this.houseInfoFormGroup.invalid) {
      console.warn("Invalid/incomplete form data. Form not submitted.")
      // .markAllAsTouched() => touching all fields triggers the display of the error messages
      this.houseInfoFormGroup.markAllAsTouched();
      return;
    }

    // fill in remaining house object properties
    this.houseInfoFormGroup.controls.pictureUrl.setValue(this.pictureUrl);

    // TODO: Delete this
    // don't think I need this.... but leaving it here for now.
    // const areas: string = this.choicesObj.getValue(true); // ignore the red squiggly... this works


    console.debug("new house object is:");
    console.debug(this.houseInfoFormGroup.value);

    this.houseInfoService.saveNewHouse(this.houseInfoFormGroup.value).subscribe({
        next: response => {
          console.info(`house ${response.houseName} was saved successfully.`);
        },
        error: err => {
          alert("There was an error in attempting to save the new house: " + err.message + " status is : " + err.status);
        }
      },
    )


  } // end onSubmit()

  // IMAGE UPLOAD METHODS

  // executed when user chooses a new photo
  onUploadedImage(image: ImageFileObject) {
    // validate image
    this.imageError = this.imageService.validateImage(image);
    // if image object is valid, assign it to local imageUploadObj
    if (!this.imageError) {
      this.imageUploadObj = image;
    }

    // upload the file to server
    this.fileUploadService.pushFileToStorage(this.imageUploadObj.file, this.profileImageUploadUrl)
      .subscribe(next => {
          console.log("image successfully uploaded")
          this.pictureUrl = next.fileDownloadUri;
          this.imageUploadObj = {} as ImageFileObject;
        },
        err => this.handleError(err));
  }

  handleError(err: Error) {
    console.error("Error is", err);
    this.imageError = err.message;
  }

} // end class
