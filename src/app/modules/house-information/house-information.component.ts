import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  OnChanges,
  OnDestroy
} from '@angular/core';
import {Options} from 'ngx-google-places-autocomplete/objects/options/options';
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {FormGroup, Validators, FormArray, Form} from "@angular/forms";
import {House} from '../../shared/models/house'
import {ImageValidationService} from "../../shared/services/image-validation.service";
import {FileUploadService} from "../../shared/services/file-upload.service";
import {ImageFileObject} from "../../shared/models/image-file-object";

import {HouseService} from "../../shared/services/house.service";
import {AreasService} from "../../shared/services/areas.service";
import {Area} from "../../shared/models/area";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {ActivatedRoute, Router} from "@angular/router";
import {fadeInAnimation} from "../../shared/animations";
import 'bootstrap-notify'

import * as $ from "jquery";
declare const Choices: any;

@Component({
  selector: 'app-house-information',
  templateUrl: './house-information.component.html',
  styleUrls: ['./house-information.component.css'],
  // make fade in animation available to this component
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' }
})
export class HouseInformationComponent implements OnInit, OnDestroy {

  isNewHouse: boolean = true;

  // house object that can be used throughout component for display purposes if needed
  currentHouse: House = {} as House;

  // // Event emitter for houseSave/Update
  // @Output() houseSaveEvent = new EventEmitter();

  // // holds function that turns off choices event listening
  choicesUnlisten: any;

  // form object
  houseInfoFormGroup: FormGroup;
  areasToAddToForm: Area[] = [];


  // variable that can be used to manipulate choices.js object
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
              private imageService: ImageValidationService,
              private fileUploadService: FileUploadService,
              private houseInfoService: HouseService,
              private areasService: AreasService,
              private route: ActivatedRoute,
              private router: Router) {
    this.houseInfoFormGroup = this.rxFormBuilder.formGroup(House);
    console.debug("house-information.component constructor called");
  }

  displaySuccessAlert(houseName: string) {

    const uploadMethod: string = this.isNewHouse ? 'saved' : 'updated';

    $.notify({
      // options
      message: 'House saved successfully!'
    },{
      // settings
      type: 'success',
      placement: {
        align: 'center'
      },
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      delay: 1,
      template:
        '<div class="col-xs-11 col-sm-5 alert alert-success alert-dismissible fade show" style="text-align: center" role="alert">' +
        '        <span class="alert-icon" style="color: white"><i class="ni ni-like-2"></i></span>' +
        `        <span class="alert-text" style="color: white"><strong>Success! </strong> ${houseName} has been ${uploadMethod}!</span>` +
        '        </button>' +
        '    </div>'
    });
  }

  ngOnInit(): void {
    console.log("ngOnInit() called");

    // CHOICES.JS SETUP
    // This app takes advantage of the event emitted by Choices.js when a
    // new item is added by adding new items to the areas object inside of a house
    // object. When populating the form after a router event to view a saved
    // houses information, the area's that are already present should
    // not be saved again, so by using choicesUnlisten(), which turns off
    // auto-adding new areas, double saving events can be avoided during
    // population of the form.... *hopefully*
    this.turnOnChoicesAddItemEventListening();

    // turn on 'removeItem' listening
    this.renderer.listen(
      document,
      'removeItem',
      (event) => {
        console.log(`Choices 'removeItem' listener working. Event is: ${event.detail.value}`);
        this.removeAreaFromHouse(event.detail.value);
      }
    );

    // initializes the "Areas" Choices plugin
    if (document.getElementById('areas')) {
      console.debug("areas element found!")

      console.debug("creating new choices element")
      const areas = document.getElementById('areas');
      this.choicesObj = new Choices(areas, {
        delimiter: ',',
        editItems: true,
        maxItemCount: 10,
        removeItemButton: true,
        addItems: true,
        duplicateItemsAllowed: false,
        placeholderValue: "Enter areas of your house here"
      });
    }

    this.route.paramMap.subscribe( {
      next: params => {
        if(params.has('houseId')) {

          console.debug("houseId param is " + params.get('houseId'));

          if(params.get('houseId') === "createNewHouse") {
            console.debug("/createNewHouse path detected");
            this.isNewHouse = true;
            this.cleanForm();
            this.choicesObj.setValue(['Kitchen', 'Living Room', 'Dining Room']);

            console.debug("areasToAddToForm[] is:");
            console.debug(this.areasToAddToForm);

          } else {
            this.houseInfoService.getHouse(params.get('houseId')!).subscribe({
              next: house => {
                this.isNewHouse = false;
                this.currentHouse = house;
                this.cleanForm();
                this.populateFormData(house);
              }
            });
          }
        } // end if(params.has('houseId'))
      } // end next: params =>
    });

  } // end ngOnInit

  cleanForm() {

    console.debug("Clearing form...")

    this.choicesObj.clearStore();
    this.areasToAddToForm = [];
    let areasFormArray = <FormArray>this.houseInfoFormGroup.controls.areas;
    areasFormArray.clear();
    console.debug("areasFormArray is:");
    console.debug(areasFormArray.value);

    // this.houseInfoFormGroup.controls.areas.reset();
    this.houseInfoFormGroup.reset()
  }

  // handles all things regarding initializing the form
  populateFormData (house: House) {

    console.debug("Form data is being populated.");

    // Populate form data
    this.houseInfoFormGroup.patchValue(house);

    // this.pictureUrl is what is passed to the image-picker for display
    this.pictureUrl = house.pictureUrl;

    // area names to add to form if populating an existing house
    let areaNames: string[] = [];
    if(!this.isNewHouse && house) {

      // add the existing areas to the empty areasToAddToFrom
      house.areas.forEach(area => {this.areasToAddToForm.push(area)});

      // get an array of area names to display to the user
      areaNames = house.areas.map(area => area.areaName);

      // turn listening off so areas aren't duplicated while populating the areas form field
      console.debug("Turning Choices.js event listening off.");
      this.choicesUnlisten();

      console.debug("Setting area values to: "  + areaNames);
      this.choicesObj.setValue(areaNames);

      // turn listening back on after areas field is populated so that new entries are handled properly
      console.debug("Turning Choices.js event listening on.");

      this.turnOnChoicesAddItemEventListening();
    } // end "if(!this.isNewHouse && house) {...."
  } // end populateFormData()

  turnOnChoicesAddItemEventListening() {

    console.debug("Turning on choices listening")

    this.choicesUnlisten = this.renderer.listen(
      document,
      'addItem',
      (event) => {
        console.log(`Choices 'addItem' listener working. Event is: ${event.detail.value}`);
        this.addAreaToHouse(event.detail.value);
      }
    );
  }

  // Spring doesn't want to accept an Area[] that has a mix of area
  // objects that do and do not have areaIds. If the user is trying to create
  // a new house, then the areas will be new as well, and none of them will
  // have areaIds.
  // If the user is trying to update a house *and add a new area*, then this
  // will save the area to server first, and then add the area w/ areaId
  // to the FormArray of area objects.
  addAreaToHouse(areaName: string) {

    // package area name in area object to send to back end
    const areaToSave: Area = {areaName: areaName};

    if (this.isNewHouse) {
      console.debug("adding area to unsaved house");
      this.areasToAddToForm.push(areaToSave);
    } else {
      console.debug("adding area to saved house");
      this.areasService.saveAreaToServer(areaToSave).subscribe({
        next: response => {
          areaToSave.areaId = response.areaId;
          this.areasToAddToForm.push(areaToSave);
        },
        error: err => {
          console.error("There was an error saving the house to the server. Error: " + err.message)
        }}
      )
    } // end if/else conditional
  } // end addAreaToHouse()

  public removeAreaFromHouse(areaName: string) {
    console.debug(`Removing ${areaName} from areasToAddToForm[]`);
    this.areasToAddToForm = this.areasToAddToForm.filter( (area) => {
      return area.areaName != areaName;
    })
    console.debug("areasToAddToForm[] is: ");
    console.debug(this.areasToAddToForm);
  } // end removeAreaFromHouse();

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
    console.debug('Attempting to populate a new house object');

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
    let areas = <FormArray>this.houseInfoFormGroup.controls.areas;
    this.areasToAddToForm.forEach(area => areas.push(this.rxFormBuilder.formGroup(Area, area)));

    console.debug("House object being uploaded from form is:");
    console.debug(this.houseInfoFormGroup.value);

    if(this.isNewHouse) {
      this.houseInfoService.saveNewHouse(this.houseInfoFormGroup.value).subscribe({
          next: response => {
            console.info(`house ${response.houseName} was saved successfully.`);

            // update sidebar to reflect new added house
            this.houseInfoService.updateUserHouses();

            let redirectUrl: string = `/houses/${response.houseId}`;
            this.router.navigate([redirectUrl]);
            this.displaySuccessAlert(response.houseName);
          },
          error: err => {
            alert("There was an error in attempting to save the new house: " + err.message + " status is : " + err.status);
          }
        }
      );
    } else {
      this.houseInfoService.updateHouse(this.houseInfoFormGroup.value).subscribe({
          next: response => {
            this.currentHouse = this.houseInfoFormGroup.value;
            console.info(`house ${response.houseName} was updated successfully.`);

            // The areas part of the form was exhibiting some weird behavior after an update
            // I think this was b/c there was no change in url and therefore the form wasn't getting reset properly
            // this is to imitate a redirect
            this.cleanForm();
            this.populateFormData(this.currentHouse);

            // let redirectUrl: string = `/houses/${response.houseId}`;
            // this.router.navigate([redirectUrl]);

            // update sidebar to reflect new added house
            this.houseInfoService.updateUserHouses();
            this.displaySuccessAlert(response.houseName);
          },
          error: err => {
            alert("There was an error in attempting to update the house: " + err.message + " status is : " + err.status);
          }
        },
      );
    } // end if/else conditional

  } // end onSubmit()

  // IMAGE UPLOAD METHODS

  // executed when user chooses a new photo
  // imageFileObject is emitted from image-picker.component
  onUploadedImage(imageFileObject: ImageFileObject) {

    console.debug("onUploadImage() called");

    // if the image picker doesn't send an empty object, then process it
    if (imageFileObject) {

      console.debug("imageFileObject not empty.");
      console.debug("Running image validation...");
      // validate image
      this.imageError = this.imageService.validateImage(imageFileObject);
      // if image object is valid, assign it to local imageUploadObj
      if (!this.imageError) {
        this.imageUploadObj = imageFileObject;

        // upload the file to server
        this.fileUploadService.pushFileToStorage(this.imageUploadObj.file, this.profileImageUploadUrl)
          .subscribe({
            next: next => {
              console.log("image successfully uploaded")
              this.pictureUrl = next.fileDownloadUri;
              this.imageUploadObj = {} as ImageFileObject;
            },
            error: err => {
              this.handleError(err)
            }
          });
      } // end "if (!this.imageError) {..."
    } else {

      console.debug("imageFileObject empty.");
      console.debug("Using placeholder URL for upload.")

      // TODO: this value is duplicated in image-picker.component.ts -- find a way to only have one source
      this.pictureUrl = "";
    }

  } // end onUploadImage()

  handleError(err: Error) {
    console.error("Error is", err);
    this.imageError = err.message;
  }

  ngOnDestroy() {
  }

} // end class
