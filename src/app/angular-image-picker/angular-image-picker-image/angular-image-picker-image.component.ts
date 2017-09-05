import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
export class AngularImagePickerImageComponent implements OnInit {

    effect: Function;
    effects = Filters;
    effectAdjustment: number = 1;
    blueScaleAdjustment: number = 1;
    greenScaleAdjustment: number = 1;
    redScaleAdjustment: number = 1;
    imageForm: FormGroup;

    /*
    * Interfaces
    */
    @Output() imageAfterBase64: string; // image after effect
    @Output() imageBeforeBase64: string; // image before effect
    @Output() fileBefore: File; // file from an <input type="file">
    @Output() fileAfter: File; // file from manipulation

    /*
    * control letiables
    */
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

    @Input('file') // Set in template as component attr
    set _file(fileBefore: File) {
      this.fileBefore = fileBefore;
      this.loadImages();

    }

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.reader = new FileReader();
    }

    ngOnInit(){
        this.startImageForm();
    }

    private startImageForm(){
        this.imageForm = this.formBuilder.group({
            redScale: [this.effectAdjustment],
            blueScale: [this.effectAdjustment],
            greenScale: [this.effectAdjustment],
        });

        this.imageForm.controls.blueScale.valueChanges
        .debounceTime(300)
        .subscribe((blueScale) => {
            this.blueScaleAdjustment = blueScale;
            this.effectAdjustment = blueScale;
            this.loadImages();
        });

        this.imageForm.controls.greenScale.valueChanges
        .debounceTime(300)
        .subscribe((greenScale) => {
            this.greenScaleAdjustment = greenScale;
            this.effectAdjustment = greenScale;
            this.loadImages();
        });

        this.imageForm.controls.redScale.valueChanges
        .debounceTime(300)
        .subscribe((redScale) => {
            this.redScaleAdjustment = redScale;
            this.effectAdjustment = redScale;
            this.loadImages();
        });
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
        .then(this.applyEffect)
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
        return new Promise<any>((res, rej) => {
            this.imageElementBefore = document.createElement("img");
            this.imageElementBefore.src = this.imageBeforeBase64;
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
            // Get Manipulation Canvas Context
            this.manipulationCanvasContext = this.manipulationCanvas.getContext("2d");
            // Draw the image
            this.manipulationCanvasContext.drawImage(this.imageElementBefore, 0, 0, this.imageAfterMetadata.width, this.imageAfterMetadata.height);
            res();
        });
    }

    private applyEffect = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            if(this.effect){
                let imageData = this.manipulationCanvasContext.getImageData(0, 0, this.manipulationCanvas.width, this.manipulationCanvas.height);
                // APPLY EFECT HERE
                this.effect(imageData, this.effectAdjustment, this.blueScaleAdjustment, this.greenScaleAdjustment, this.redScaleAdjustment);
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

    setEffect = (effect) => {
        this.effect = effect;
        this.loadImages();
    }

    setEffectAdjustment = (effectAdjustment) => {
        this.effectAdjustment = effectAdjustment;
        this.loadImages();
    }
}


/*
* Built in canvas filters
*/
export const Filters: Array<any> = [];

Filters.push({name: 'Graycsale', effect: (imageData) => {
    let d = imageData.data;
    for (let i=0; i<d.length; i+=4) {
      let r = d[i];
      let g = d[i+1];
      let b = d[i+2];
      let v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v
    }
}});

Filters.push({name: 'Light-Graycsale', effect: (imageData) => {
    let d = imageData.data;
    for (let i=0; i<d.length; i+=4) {
      let r = d[i];
      let g = d[i+1];
      let b = d[i+2];
      let v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v;
      d[i] += d[i];
      d[i+1] += d[i+1];
      d[i+2] += d[i+2];
    }
}});

Filters.push({name: 'Redscale', effect: (imageData, adjustment, blueScaleAdjustment, greenScaleAdjustment, redScaleAdjustment) => {
  let d = imageData.data;
  for (let i=0; i<d.length; i+=4) {
    d[i] = redScaleAdjustment;
    d[i+1] += blueScaleAdjustment;
    d[i+2] += redScaleAdjustment;
  }
}});

Filters.push({name: 'Greenscale', effect: (imageData, adjustment) => {
  let d = imageData.data;
  for (let i=0; i<d.length; i+=4) {
    let r = d[i];
    let g = d[i+1];
    let b = d[i+2];
    d[i] = d[i];
    d[i+1] += adjustment;
    d[i+2] += d[i+2];
  }
}});

Filters.push({name: 'Bluescale', effect: (imageData, adjustment) => {
  let d = imageData.data;
  for (let i=0; i<d.length; i+=4) {
    let r = d[i];
    let g = d[i+1];
    let b = d[i+2];
    d[i] = d[i];
    d[i+1] += d[i+1];
    d[i+2] += adjustment;
  }
}});

Filters.push({name: 'Brightness', effect: (imageData, adjustment) => {
  let d = imageData.data;
  for (let i=0; i<d.length; i+=4) {
    let r = d[i];
    let g = d[i+1];
    let b = d[i+2];
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
}});