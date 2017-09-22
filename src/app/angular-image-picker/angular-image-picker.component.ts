import { Component, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Image } from './../image'
import { Media } from './media.model'

const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1080;

@Component({
  selector: 'tzd-angular-image-picker',
  templateUrl: './angular-image-picker.component.html',
  styleUrls: ['./angular-image-picker.component.scss']
})
export class AngularImagePickerComponent implements OnInit {
  // Dialog Ref to be closed after success save
  @Input() dialogRef: any;

  @Input() save: Function;

  // Internal meta data
  private imageList: Observable<Image[]>;
  private media: Media[];

  // File references
  public files: FileList;
  public file_srcs: any[];
  public resizedFiles: any[];

  // Size before and after
  public debug_size_before: any[];
  public debug_size_after: any[];

  // Controllers

  constructor(
              ) {}


  ngOnInit() {
    this.debug_size_before = [];
    this.debug_size_after = [];
    this.file_srcs = [];
  }


  getTotalFilesSize(reduced ) {
    let total = 0;
    if (this.resizedFiles) {
      for (let i = 0; i < this.resizedFiles.length; i++) {
        total += this.resizedFiles[i].size;
      };
    }
    return reduced ? this.getReducedSizeRepresentation(total) : total;
  }


  getReducedSizeRepresentation(total = 0) {
    switch (true) {
      case total < 1000:
      return `${total.toFixed(1)}B`;
      case total < 1000000:
      return `${(total / 1000).toFixed(1)}KB`;
      case total < 1000000000:
      return `${(total / 1000000).toFixed(1)}MB`;
      case total < 1000000000000:
      return `${(total / 1000000000).toFixed(1)}GB`;
    }
  }

  // this methos is called by the html when the input file changes
  updateFilesToLoad() {
    this.files = (<HTMLInputElement>document.getElementById('files')).files;
    this.resizedFiles = [];
    this.readFiles(this.files, 0);
  }

  private dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }


  private readFile = (file, reader, callback) => {
    reader.onload = () => {
      callback(reader.result);
    }
    reader.readAsDataURL(file);
  }

  private readFiles = (files, index= 0) => {
    // Create the file reader
    const reader = new FileReader();

    // If there is a file
    if (index in files) {
      // Start reading this file
      this.readFile(files[index], reader, (result) => {
        // Create an img element and add the image file data to it
        const img = document.createElement('img');
        img.src = result;

        // Send this img to the resize function (and wait for callback)
        this.resize(img, files[index].name, (resized_jpeg, before, after) => {
          // For debugging (size in bytes before and after)
          this.debug_size_before.push(before);
          this.debug_size_after.push(after);

          // Add the resized jpeg img source to a list for preview
          // This is also the file you want to upload. (either as a
          // base64 string or img.src = resized_jpeg if you prefer a file).
          this.file_srcs.push(resized_jpeg);

          // Read the next file;
          this.readFiles(files, index + 1);
        });
      });
    } else {
    }
  }

  private resize(img, filename, callback) {
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {
      // Get the images current width and height
      let width = img.width;
      let height = img.height;

      // Set the WxH to fit the Max values (but maintain proportions)
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // create a canvas object
      const canvas = document.createElement('canvas');

      // Set the canvas to the new calculated dimensions
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0,  width, height);

      // Get this encoded as a jpeg
      // IMPORTANT: 'jpeg' NOT 'jpg'
      const dataUrl = canvas.toDataURL('image/jpeg');
      const blob: Blob = this.dataURItoBlob(dataUrl);
      const resizedFile = new File([blob], filename);
      this.resizedFiles.push(resizedFile);
      // callback with the results
      callback(dataUrl, img.src.length, dataUrl.length);
    };

  }

  getNewImageDimensions = (img, callback) => {
    img.onload = () => {
      // Get the images current width and height
      let width = img.width;
      let height = img.height;

      // Set the WxH to fit the Max values (but maintain proportions)
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      callback(width, height);
    }
  }
}
