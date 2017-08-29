import { Component, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from './../image'
import { Media } from './media.model'

const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1080;

@Component({
    selector: 'angular-image-picker',
    templateUrl: './angular-image-picker.component.html',
    styleUrls: ['./angular-image-picker.component.scss']
})
export class AngularImagePickerComponent implements OnInit {
    // Dialog Ref to be closed after success save
    @Input() dialogRef: any;

    @Input() save: Function;

    // Internal meta data
    private imageList : Observable<Image[]>;
    private media: Media[];

    // File references
    public files: FileList;
    public file_srcs: any[];
    public resizedFiles: any[];

    // Size before and after
    public debug_size_before: any[];
    public debug_size_after: any[];

    // Controllers
    public seeSaved: boolean;

    constructor(
    ){}


    ngOnInit() {
        this.debug_size_before = [];
        this.debug_size_after = [];
        this.file_srcs = [];
        this.seeSaved = false;
    }


    getTotalFilesSize(){
        let total = 0;
        if(this.resizedFiles){
            for(let i = 0; i < this.resizedFiles.length; i++) {
                total += this.resizedFiles[i].size;
            };
        }
        return total;
    }


    getSizeInMb(total = 0){
        return total / 1000000;
    }

    updateFilesToLoad(){
        this.files = (<HTMLInputElement>document.getElementById('files')).files;
        this.resizedFiles = [];
        this.readFiles(this.files, 0);
    }

    private dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = decodeURI(dataURI.split(',')[1]);

        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }


    private readFile = (file, reader, callback) => {
      reader.onload = () => {
        callback(reader.result);
      }
      reader.readAsDataURL(file);
    }

    private readFiles = (files, index=0) => {
      // Create the file reader
      let reader = new FileReader();

      // If there is a file
      if(index in files){
        // Start reading this file
        this.readFile(files[index], reader, (result) => {
          // Create an img element and add the image file data to it
          let img = document.createElement("img");
          img.src = result;

          // Send this img to the resize function (and wait for callback)
          this.resize(img, files[index].name, (resized_jpeg, before, after)=>{
            // For debugging (size in bytes before and after)
            this.debug_size_before.push(before);
            this.debug_size_after.push(after);

            // Add the resized jpeg img source to a list for preview
            // This is also the file you want to upload. (either as a
            // base64 string or img.src = resized_jpeg if you prefer a file).
            this.file_srcs.push(resized_jpeg);

            // Read the next file;
            this.readFiles(files, index+1);
          });
        });
      } else {
      }
    }

    private resize(img, filename, callback){
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
        let canvas = document.createElement("canvas");

        // Set the canvas to the new calculated dimensions
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0,  width, height);

        // Get this encoded as a jpeg
        // IMPORTANT: 'jpeg' NOT 'jpg'
        let dataUrl = canvas.toDataURL('image/jpeg');
        let blob: Blob = this.dataURItoBlob(dataUrl);
        let resizedFile = new File([blob], filename);
        this.resizedFiles.push(resizedFile);
        // callback with the results
        callback(dataUrl, img.src.length, dataUrl.length);
      };

    }

    // Efects
    applyEfect = (efect) => {
        console.log('bwEfct')
        let reader = new FileReader();
        // Start reading this file
        this.readFile(this.files[0], reader, (result) => {
            // Create an img element and add the image file data to it
            let img = document.createElement("img");
            img.src = result;
            this.getNewImageDimensions(img, (width, height) => {
              // create a canvas object
              let canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              // apply the efect
              this.applyEfectToContext(canvas, img, efect);
              // Get this encoded as a jpeg
              // IMPORTANT: 'jpeg' NOT 'jpg'
              let dataUrl = canvas.toDataURL('image/jpeg');
              let blob: Blob = this.dataURItoBlob(dataUrl);
              let resizedFile = new File([blob], this.files[0].name);
              this.resizedFiles.push(resizedFile);
              // callback with the results
              this.file_srcs.push(dataUrl);

          });
        });
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

    applyEfectToContext = (canvas, img, efect) => {
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // APPLY EFECT HERE
        efect(imageData, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
    }

    zoonEfect = (imageData, width, heigth) => {
        for(var y = 0; y < imageData.height; y++){
            for(var x = 0; x < imageData.width; x++){
                var i = (y * 4) * imageData.width + x * 4;
                var avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                imageData.data[i] = avg;
                imageData.data[i + 1] = avg;
                imageData.data[i + 2] = avg;
            }
        }
    }

    bwEffect = (imageData, width, heigth) => {
        for(var y = 0; y < imageData.height; y++){
            for(var x = 0; x < imageData.width; x++){
                var i = (y * 4) * imageData.width + x * 4;
                var avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                imageData.data[i] = avg;
                imageData.data[i + 1] = avg;
                imageData.data[i + 2] = avg;
            }
        }
    }

    grayScale = (imageData, width, heigth) => {
        var d = imageData.data;
        for (var i=0; i<d.length; i+=4) {
          var r = d[i];
          var g = d[i+1];
          var b = d[i+2];
          // CIE luminance for the RGB
          // The human eye is bad at seeing red and blue, so we de-emphasize them.
          var v = 0.2126*r + 0.7152*g + 0.0722*b;
          d[i] = d[i+1] = d[i+2] = v
        }
        return imageData;
    }

    brightness = (imageData, adjustment = 0.1) => {
        var d = imageData.data;
        for (var i=0; i<d.length; i+=4) {
          d[i] += adjustment;
          d[i+1] += adjustment;
          d[i+2] += adjustment;
        }
        return imageData;
    }
}


// https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
var Filters: any = {};

Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img);
  return ctx.getImageData(0,0,c.width,c.height);
};

Filters.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

Filters.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i=2; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};
