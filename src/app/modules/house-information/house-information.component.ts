import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, OnChanges} from '@angular/core';
import {Options} from 'ngx-google-places-autocomplete/objects/options/options';
import {Address} from "ngx-google-places-autocomplete/objects/address";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import {House} from '../../shared/models/house'
import {ImageService} from "../../shared/services/image.service";
import {FileUploadService} from "../../shared/services/file-upload.service";
import {ImageFileObject} from "../../shared/models/image-file-object";

import {HouseService} from "../../shared/services/house.service";
import {AreasService} from "../../shared/services/areas.service";
import {Area} from "../../shared/models/area";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {map} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

declare const Choices: any;

@Component({
  selector: 'app-house-information',
  templateUrl: './house-information.component.html',
  styleUrls: ['./house-information.component.css']
})
export class HouseInformationComponent implements OnInit {

  isNewHouse: boolean = true;

  // // Event emitter for houseSave/Update
  // @Output() houseSaveEvent = new EventEmitter();

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
              private houseInfoService: HouseService,
              private areasService: AreasService,
              private route: ActivatedRoute,) {
    this.houseInfoFormGroup = this.rxFormBuilder.formGroup(House);
  }

  ngOnInit(): void {
    // listener for Choices events
    this.renderer.listen(
      document,
      'addItem',
      (event) => {
        this.AddAreaToHouse(event.detail.value);
        console.log(`Choices listener working. Event is: ${event.detail.value}`);
      });

    // This retrieves whether this component is considered to be for a new House or an existing house
    console.debug(this.route.snapshot.url[1].path);
    this.isNewHouse = this.route.snapshot.url[1].path === "createNewHouse";
    console.debug("isNewHouseValue is: " + this.isNewHouse);

    if(!this.isNewHouse) {
      // This retrieves the house object in order to auto-populate the fields of the form
      this.route.paramMap.pipe(map(() => window.history.state))
        .subscribe(next => {
          // if there is no state object (fresh/re-load)
          if(!next.house) {
            // get the houseId param and make server request to get corresponding house object
            this.houseInfoService.getHouse(next.navigationId).subscribe({
              next: value => {
                console.warn("Newly loaded page's state did not include a House object.");
                console.debug(`Retried house ${next.navigationId} object from server`);
                console.log("Server response is: ");
                console.log(value);
                this.houseInfoFormGroup.patchValue(value);
              },
              error: err => {
                console.warn("There was an error retrieving the house object from the server. ");
              }});
          } else { // else called by router
            console.log("House object retrieved from state is: ");
            console.log(next.house);

            this.houseInfoFormGroup.patchValue(next.house);
          }
        });
    }

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

  // Spring doesn't want to accept an Area[] that has a mix of area
  // objects that do and do not have areaIds. If the user is trying to create
  // a new house, then the areas will be new as well, and none of them will
  // have areaIds. In this instance, this will call addAreaToUnsavedHouse()
  // which will create a FormArray of area objects, all w/o areaIds.
  // If the user is trying to update a house _and add a new area_, then this
  // will call addAreaToSavedHouse() which will save the area to server first,
  // and then add the area w/ areaId to the FormArray of area objects.
  AddAreaToHouse(areaName: string) {

    if (this.isNewHouse) {
      this.addAreaToUnsavedHouse(areaName);
    } else {
      this.addAreaToSavedHouse(areaName);
    }

  }

  // saves area to form group as user enters it
  addAreaToUnsavedHouse(areaName: string) {
    console.debug("addAreaToUnsavedHouse() called");

    // holds area objects when user enters them
    let areas = <FormArray>this.houseInfoFormGroup.controls.areas;

    // package area name in area object to add to formGroup
    const areaToSave: Area = {areaName: areaName};

    areas.push(this.rxFormBuilder.formGroup(Area, areaToSave))

  }

  // saves area to server as user enters it, and then saves result to formGroup
  addAreaToSavedHouse(areaName: string) {
    console.debug("addAreaToSavedHouse() called");

    // holds area objects when user enters them
    let areas = <FormArray>this.houseInfoFormGroup.controls.areas;

    // package area name in area object to send to back end
    const areaToSave: Area = {areaName: areaName};
    this.areasService.saveAreaToServer(areaToSave).subscribe({
      next: response => {
        areaToSave.areaId = response.areaId;
        areas.push(this.rxFormBuilder.formGroup(Area, areaToSave));
      },
      error: err => {
        console.error("There was an error saving the house to the server. Error: " + err.message)
      }}
    )
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
