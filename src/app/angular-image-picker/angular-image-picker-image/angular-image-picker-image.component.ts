import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReducedMemoryRepresentation } from './../helpers';
import { Filters } from './../filters';
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
  selector: 'tzd-image-picker-image',
  templateUrl: './angular-image-picker-image.component.html',
  styleUrls: ['./angular-image-picker-image.component.scss']
})
export class AngularImagePickerImageComponent implements OnInit {

    effectName: string;
    effects = Object.keys(Filters.effects);
    effectAdjustment = 1;
    blueScaleAdjustment = 1;
    greenScaleAdjustment = 1;
    redScaleAdjustment = 1;
    imageForm: FormGroup = new FormGroup({});
    ReducedMemoryRepresentation = ReducedMemoryRepresentation;

    /*
    * Interfaces
    */
    @Output() imageAfterBase64: string; // image after effect
    @Output() imageBeforeBase64: string; // image before effect
    @Output() fileBefore: File; // file from an <input type="file">
    @Output() fileAfter: File; // file from manipulation
    @Output() sizeAfter: number; // image size after effect
    @Output() sizeBefore: number; // image size before effect

    /*
    * Default maximum image size (in px) to optimise and reduce the image size in memory
    */
    @Input() maxWidth = 1080;
    @Input() maxHeight = 1080;

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

    /*
    * control variables
    */
    private imgElBefore: HTMLImageElement;
    private imgElAfter: ImageMetadata;
    private workingCanvas: HTMLCanvasElement;
    private workingCanvasContext: CanvasRenderingContext2D;
    private reader: FileReader; // global file reader

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.reader = new FileReader();
    }

    ngOnInit() {
        this.startImageForm();
    }

    private startImageForm() {
        this.imageForm = this.formBuilder.group({
            redScale: [0],
            blueScale: [0],
            greenScale: [0],
            effectAdjustment: [0],
        });

        this.imageForm.controls.blueScale.valueChanges
        .debounceTime(200)
        .subscribe((blueScale) => {
            this.blueScaleAdjustment = blueScale;
            if (this.effectName) {
                this.loadImages();
            }
        });

        this.imageForm.controls.greenScale.valueChanges
        .debounceTime(200)
        .subscribe((greenScale) => {
            this.greenScaleAdjustment = greenScale;
            if (this.effectName) {
                this.loadImages();
            }
        });

        this.imageForm.controls.redScale.valueChanges
        .debounceTime(200)
        .subscribe((redScale) => {
            this.redScaleAdjustment = redScale;
            if (this.effectName) {
                this.loadImages();
            }
        });

        this.imageForm.controls.effectAdjustment.valueChanges
        .debounceTime(200)
        .subscribe((effectAdjustment) => {
            this.effectAdjustment = effectAdjustment;
            if (this.effectName) {
                this.loadImages();
            }
        });
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

    private loadImages() {
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
                this.sizeBefore = this.imageBeforeBase64.length;
                res();
            }
            this.reader.readAsDataURL(this.fileBefore);
        });
    }

    private loadImageBefore = (): Promise<ImageMetadata> => {
        return new Promise<any>((res, rej) => {
            this.imgElBefore = document.createElement('img');
            this.imgElBefore.src = this.imageBeforeBase64;
            this.imgElBefore.onload = () => {
                res()
            }
        })
    }

    private defineNewSize = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            // Get the images current width and height
            let width = this.imgElBefore.width;
            let height = this.imgElBefore.height;

            // Set the WxH to fit the Max values (but maintain proportions)
            if (width > height) {
                if (width > this.maxWidth) {
                    height *= this.maxWidth / width;
                    width = this.maxWidth;
                }
            } else {
                if (height > this.maxHeight) {
                    width *= this.maxHeight / height;
                    height = this.maxHeight;
                }
            }
            this.imgElAfter = {
                width: width,
                height: height,
                name: (this.imgElAfter && this.imgElAfter.name) ? this.imgElAfter.name : this.imgElBefore.name
            };
            res();
        })
    }

    private createManipulationCanvas = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            // create a canvas object
            this.workingCanvas = document.createElement('canvas');
            // Set the canvas to the new calculated dimensions
            this.workingCanvas.width = this.imgElAfter.width;
            this.workingCanvas.height = this.imgElAfter.height;
            // Get Manipulation Canvas Context
            this.workingCanvasContext = this.workingCanvas.getContext('2d');
            // Draw the image
            this.workingCanvasContext.drawImage(this.imgElBefore, 0, 0, this.imgElAfter.width, this.imgElAfter.height);
            res();
        });
    }

    private applyEffect = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            if (this.effectName) {
                const imageData = this.workingCanvasContext.getImageData(0, 0, this.workingCanvas.width, this.workingCanvas.height);
                const runEffect = Filters.effects[this.effectName];
                runEffect(imageData, this.effectAdjustment, this.blueScaleAdjustment, this.greenScaleAdjustment, this.redScaleAdjustment);
                this.workingCanvasContext.putImageData(imageData, 0, 0, 0, 0, this.workingCanvas.width, this.workingCanvas.height);
            } else {
                this.resetImage();
            }
            res();
        });
    }

    private makeNewImageFile = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            this.imageAfterBase64 = this.workingCanvas.toDataURL('image/jpeg');
            this.sizeAfter = this.imageAfterBase64.length;
            const blob: Blob = this.dataURItoBlob(this.imageAfterBase64);
            this.fileAfter = new File([blob], `${this.fileBefore.name}-${Date.now()}`);
            res();
        });
    }

    private resetImage = () => {
        return new Promise<any>((res, rej) => {
            this.workingCanvasContext.drawImage(this.imgElBefore, 0, 0, this.imgElAfter.width, this.imgElAfter.height);
            res();
        });
    };

    setEffect = (effectName) => {
        if (!effectName) {
            this.imageForm.reset({
                redScale: 0,
                blueScale: 0,
                greenScale: 0,
                effectAdjustment: 0,
            });
        }
        this.effectName = effectName;
        this.loadImages();
    }

    setEffectAdjustment = (effectAdjustment) => {
        this.effectAdjustment = effectAdjustment;
        this.loadImages();
    }
}
