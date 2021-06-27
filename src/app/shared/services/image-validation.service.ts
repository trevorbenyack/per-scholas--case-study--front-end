import { Injectable } from '@angular/core';
import {ImageFileObject} from "../models/image-file-object";

const maxUploadSize: number = 5242880;
const allowedExtensions: string[] = ['png', 'jpg', 'jpeg'];


/* This service includes several convenience methods for validating images*/

@Injectable({
  providedIn: 'root'
})
export class ImageValidationService {

  constructor() { }

  validateImage(image: ImageFileObject): string {
    let imageError: string = "";
    console.log("image file name is " + image.file.name);

    if (image.file.size > maxUploadSize) {
      imageError = "Image file is too large (Max 5Mb)";
    } else if (!this.validateExtension(image)) {
      imageError = "Only .jpg and .png images are allowed";
    }

    return imageError;
  }

  validateExtension(image: ImageFileObject): boolean {
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
