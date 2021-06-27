import {Component, OnInit, Output, EventEmitter, ElementRef, Renderer2, Input} from '@angular/core';
import {ImageValidationService} from "../../services/image-validation.service";
import {ImageFileObject} from "../../models/image-file-object";


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {
  // used to conditionally show preview photo

  // <img> is bound to this property. This is the image that is shown on the page.
  // it's value is the dataUrl read from the file passed in from the form.
  @Input() public image: any;
  public altImage: string = "/assets/img/house-placeholder-image.png";

  // emits image object to parent component
  @Output() uploadedImageEvent = new EventEmitter<ImageFileObject>();

  constructor(private imageService: ImageValidationService,
              private elementRef: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  // called when <input> clicked
  // takes in the file chosen by the user as a house picture
  fileChange(files: FileList | null) {
    // FileReader delivers data using events
    const reader = new FileReader();
    let imageFileObject = {} as ImageFileObject;


    // Flow (opposite of how this function is laid out):
    // 1. assign the file to the imageFileObject
    // 2. Validate the extension of the file, if it's valid:
    //    a. read it and
    //
    if (files) {
      const file = files[0]

      // adds the image file to the imageFileObject
      imageFileObject.file = file;

      let emitter = this.uploadedImageEvent;

      // .onload handler needs to be loaded before use of readAsDataUrl(file) since
      // the FileReader api is asynchronous
      // in the end this gets the file and assigns it to the class's image property
      reader.onload = (event) => {
        // creates a new HTMLImageElement
        // equivalent to document.createElement('img')
        let img = new Image();

        // (declaring .onload *before* use)
        // adds the height and width to the imageFileObject and emits it to parent
        img.onload = function (imgEvent) {
          imageFileObject.height = img.height;
          imageFileObject.width = img.width;

          emitter.emit(imageFileObject);
        } // end img.onload function

        // gets the local image location and assigns it to the img object.
        // the end goal is to use img to get the height and width properties
        // of the image to package into the imageFileObject.
        // event is the file passed in from the .readAsDataUrl
        if(event.target != null) { // shouldn't be null, but the IDE was yelling w/o the if()
          // event.target.result = dataUrl
          img.src = <string>event.target.result;
        }

        // Mozilla: ".result returns the file's contents."
        // this is what is returned when the read operation is complete
        // => Once the file is read, assign it to the class's image property
        this.image = reader.result;
      } // end reader.onload function

      // gets the image path for use in the img tag
      // if the image doesn't have a valid extension, it
      // still emits the file, but removes the thumbnail
      if (this.imageService.validateExtension(imageFileObject)) {
        reader.readAsDataURL(file);
      } else {
        this.removeImage()
      }

    } // end if (files) conditional

  } // end fileChange()

  removeImage(): void {

    console.debug("Image picker emitting an empty image object");

    // emit an empty file object
    this.uploadedImageEvent.emit();

    // change the picture on the page to the placeholder image
    this.image = this.altImage;
  }

  // Used to handle clicking/activating the hidden <input> element
  clickFileInput() {
    const inputFile: HTMLElement = this.renderer.selectRootElement("#image-upload");
    inputFile.click();
  }
}
