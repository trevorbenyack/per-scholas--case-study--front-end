import { Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { House } from '../../../shared/models/house'
import {ImageService} from "../../../shared/services/image.service";
import {FileUploadService} from "../../../shared/services/file-upload.service";
import {ImageFileObject} from "../../../shared/models/image-file-object";
import {HttpEvent, HttpResponse} from "@angular/common/http";
declare const Quill: any;
declare const Choices: any;

@Component({
  selector: 'app-create-new-house',
  templateUrl: './create-new-house.component.html',
  styleUrls: ['./create-new-house.component.css']
})
export class CreateNewHouseComponent implements OnInit {

  choicesObj: typeof Choices; // used to get areas values from form

  // image upload properties
  profileImageUploadUrl: string = "http://localhost:8080/api/users/photos/uploadImage";
  imageUploadObj = {} as ImageFileObject;
  changeImage = false;
  imageError: string = "";

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



  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private formBuilder: FormBuilder,
              private imageService: ImageService,
              private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {

    // initializes the "Areas" Choices plugin
    if (document.getElementById('areas')) {
      const areas = document.getElementById('areas');
      const areasChoicesObj = new Choices(areas, {
        delimiter: ',',
        editItems: true,
        maxItemCount: 10,
        removeItemButton: true,
        addItems: true
      });
      this.choicesObj = areasChoicesObj;
    }
  } // end ngOnInit

  // auto-populates address fields from Google Maps Places API
  public handleAddressChange(address: Address) {

    let street_number: string = "";

    for(let address_component of address.address_components) {
      const componentType = address_component.types[0];
      switch (componentType) {
        case "street_number": {
          street_number = address_component.long_name;
          break;
        }
        case "route": {
          this.streetAddress01?.setValue(`${street_number} ${address_component.short_name}`);
          break;
        }
        case "locality": {
          this.city?.setValue(address_component.long_name);
          break;
        }
        case "administrative_area_level_1": {
          this.state?.setValue(address_component.short_name);
          break;
        }
        case "postal_code": {
          this.zipCode?.setValue(address_component.long_name);
          break;
        }
      } // end switch statement
    } // end for-of loop
    const stAdd02Element = this.renderer.selectRootElement("#streetAddress02");
    stAdd02Element.focus();

  } // end handleAddressChange()

  houseInfoFormGroup: FormGroup = this.formBuilder.group( {
    houseName: ['',[Validators.required, Validators.minLength(2)]],
    streetAddress01: ['', [Validators.required]],
    streetAddress02: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required]],
    notes: [''],
    pictureUrl: [''],
    areas: ['']
  });

  // // Typescript Form getter methods
  get houseName() { return this.houseInfoFormGroup.get('houseName'); }
  get streetAddress01() { return this.houseInfoFormGroup.get('streetAddress01'); }
  get streetAddress02() { return this.houseInfoFormGroup.get('streetAddress02'); }
  get city() { return this.houseInfoFormGroup.get('city'); }
  get state() { return this.houseInfoFormGroup.get('state'); }
  get zipCode() { return this.houseInfoFormGroup.get('zipCode'); }
  get notes() { return this.houseInfoFormGroup.get('notes'); }
  get pictureUrl() { return this.houseInfoFormGroup.get('pictureUrl'); }
  get areas() { return this.houseInfoFormGroup.get('areas'); }

  onSubmit(form: House): void {
      console.log('populating a new house object');

      // if there are invalid values in the fields, mark all the fields as touched
      // (will show alerts for all invalid fields) and then exit the function
      // i.e. don't do anything...
      if (this.houseInfoFormGroup.invalid) {
        // .markAllAsTouched() => touching all fields triggers the display of the error messages
        this.houseInfoFormGroup.markAllAsTouched();
        return;
      }

      // ignore the red squiggly... this works
      form.areas = this.choicesObj.getValue(true);
      console.log(form);
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
      .subscribe(event => this.handleEvent(event),
        err => this.handleError(err));
  }

  handleEvent(event: HttpEvent<{}>) {
    if (event instanceof HttpResponse) {
      let body = event.body;
      this.handleResponse(body);
    }

    // reset imageUploadObj
    this.imageUploadObj = {} as ImageFileObject;
  }

  handleResponse(data: any) {
    console.log(data);

    // reset imageUploadObj
    this.imageUploadObj = {} as ImageFileObject;

  }

  handleError(err: Error) {
    console.error("Error is", err);
    this.imageError = err.message;
  }

} // class
