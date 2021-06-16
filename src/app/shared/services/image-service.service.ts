import { Injectable } from '@angular/core';
import {UploadedImage} from "../models/uploaded-image";

const maxUploadSize: number = 5242880;
const allowedExtensions: string[] = ['png', 'jpg', 'jpeg'];

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor() { }

  validateImage(image: UploadedImage): string {
    let imageError: string = "";
    console.log("image file name is " + image.file.name);

    if (image.file.size > maxUploadSize) {
      imageError = "Image file is too large (Max 5Mb)";
    } else if (!this.validExtension(image)) {
      imageError = "Only .jpg and .png images are allowed";
    }

    return imageError;
  }

  validExtension(image: UploadedImage): boolean {
    let valid: boolean = false;

    for (let i = 0; i < allowedExtensions.length; i++) {
      if (image.file.name.endsWith(allowedExtensions[i])) {
        valid = true;
        break;
      }
    }
    return valid;
  }
}
