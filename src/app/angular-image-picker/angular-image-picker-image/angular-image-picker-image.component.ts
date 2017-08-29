import { Component, Input } from '@angular/core';

/*
* Default maximum image size (in px) to optimise and reduce the image size in memory
*/
const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1080;

/*
* Dimensions
*
* Helper Interface to save image size
*
*/
export interface ImageMetadata {
    width: number;
    height: number;
    name: string;
}

@Component({
  selector: 'angular-image-picker-image',
  templateUrl: './angular-image-picker-image.component.html',
  styleUrls: ['./angular-image-picker-image.component.scss']
})
export class AngularImagePickerImageComponent {

    efect: string;
    imageAfterBase64: string; // image after efect
    imageBeforeBase64: string; // image before efect

    private fileBefore: File; // file from an <input type="file">
    private fileAfter: File; // file from manipulation
    private imageElementBefore: HTMLImageElement;
    private imageAfterMetadata: ImageMetadata;
    private manipulationCanvas: HTMLCanvasElement;
    private manipulationCanvasContext: CanvasRenderingContext2D;
    private reader: FileReader; // global file reader


    /*
    * @Input() File getter and setter
    */
    get _file(): File {
      return this.fileBefore;
    }

    @Input('file')
    set _file(fileBefore: File) {
      this.fileBefore = fileBefore;
      this.loadImages();

    }

    constructor() {
        this.reader = new FileReader();
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

    private loadImages(){
        this.readFile()
        .then(this.loadImageBefore)
        .then(this.defineNewSize)
        .then(this.createManipulationCanvas)
        .then(this.getManipulationCanvasContext)
        .then(this.drawNewImage)
        .then(this.applyEfect)
        .then(this.makeNewImageFile);

    }

    private readFile = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            this.reader.onload = () => {
                this.imageBeforeBase64 = this.reader.result;
                res();
            }
            this.reader.readAsDataURL(this.fileBefore);
        });
    }

    private loadImageBefore = (): Promise<ImageMetadata> => {
        this.imageElementBefore = document.createElement("img");
        this.imageElementBefore.src = this.imageBeforeBase64;
        return new Promise<any>((res, rej) => {
            this.imageElementBefore.onload = () => {
                res()
            }
        })
    }

    private defineNewSize = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            // Get the images current width and height
            let width = this.imageElementBefore.width;
            let height = this.imageElementBefore.height;

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
            this.imageAfterMetadata = {
                width: width,
                height: height,
                name: (this.imageAfterMetadata && this.imageAfterMetadata.name) ? this.imageAfterMetadata.name : this.imageElementBefore.name
            };
            res();
        })
    }

    private createManipulationCanvas = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            // create a canvas object
            this.manipulationCanvas = document.createElement("canvas");
            // Set the canvas to the new calculated dimensions
            this.manipulationCanvas.width = this.imageAfterMetadata.width;
            this.manipulationCanvas.height = this.imageAfterMetadata.height;
            res();
        });
    }

    private getManipulationCanvasContext = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            this.manipulationCanvasContext = this.manipulationCanvas.getContext("2d");
            res();
        });
    }

    private drawNewImage = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            this.manipulationCanvasContext.drawImage(this.imageElementBefore, 0, 0, this.imageAfterMetadata.width, this.imageAfterMetadata.height);
            res();
        });
    }

    private applyEfect = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            if(this.efect){
                let imageData = this.manipulationCanvasContext.getImageData(0, 0, this.manipulationCanvas.width, this.manipulationCanvas.height);
                // APPLY EFECT HERE
                SvgEfects[this.efect](imageData, this.manipulationCanvas.width, this.manipulationCanvas.height);
                this.manipulationCanvasContext.putImageData(imageData, 0, 0, 0, 0, this.manipulationCanvas.width, this.manipulationCanvas.height);
            } else {
                this.manipulationCanvasContext.drawImage(this.imageElementBefore, 0, 0, this.imageAfterMetadata.width, this.imageAfterMetadata.height);
            }
            res();
        });
    }

    private makeNewImageFile = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            this.imageAfterBase64 = this.manipulationCanvas.toDataURL('image/jpeg');
            let blob: Blob = this.dataURItoBlob(this.imageAfterBase64);
            this.fileAfter = new File([blob], `${this.fileBefore.name}-${Date.now()}`);
            res();
        });
    }

    setEfect = (efect) => {
        this.efect = efect;
        this.loadImages();
    }
}

export const SvgEfects = {
    grayScale: (imageData, width, heigth) => {
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
    }
}
