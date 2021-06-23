import {Component, OnInit, Output, EventEmitter, ElementRef, Renderer2, Input} from '@angular/core';
import {ImageService} from "../../services/image.service";
import {ImageFileObject} from "../../models/image-file-object";


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {
  // used to conditionally show preview photo

  @Input()
  public image: any;
  public altImage: string = "/assets/img/house-placeholder-image.png";

  // emits image to parent component
  @Output() uploadedImageEvent = new EventEmitter<ImageFileObject>();

  constructor(private imageService: ImageService,
              private elementRef: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  fileChange(files: FileList | null) {
    // FileReader delivers data using events
    const reader = new FileReader();
    let imageFileObject = {} as ImageFileObject;

    if (files) {
      const file = files[0]
      imageFileObject.file = file;

      let emitter = this.uploadedImageEvent;

      // .onload handler needs to be declared before use of readAsDataUrl(file) since
      // the FileReader api is asynchronous
      reader.onload = (event) => {
        // creates a new HTMLImageElement
        // equivalent to document.createElement('img')
        let img = new Image();

        // declaring .onload before use
        img.onload = function (imgEvent) {
          imageFileObject.height = img.height;
          imageFileObject.width = img.width;

          emitter.emit(imageFileObject);
        } // end img.onload function

        // shouldn't be null, but the IDE was yelling w/o the if()
        if(event.target != null) {
          // event.target.result = dataUrl
          img.src = <string>event.target.result;
        }
        this.image = reader.result;
      } // end reader.onload function

      // gets the image path for use in the img tag
      // if the image doesn't have a valid extension, it
      // still emits the file, but removes the thumbnail
      if (this.imageService.validExtension(imageFileObject)) {
        reader.readAsDataURL(file);
      } else {
        emitter.emit(imageFileObject);
        this.removeImage()
      }

    } // end if (files) conditional

  } // end fileChange()

  removeImage(): void {
    this.image = '';
  }

  clickFileInput() {
    const inputFile: HTMLElement = this.renderer.selectRootElement("#image-upload");
    inputFile.click();
  }
}
