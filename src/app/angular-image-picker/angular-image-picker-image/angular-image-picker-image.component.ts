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
    private imgElBefore: HTMLImageElement;
    private imgElAfter: ImageMetadata;
    private workingCanvas: HTMLCanvasElement;
    private workingCanvasContext: CanvasRenderingContext2D;
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
        .debounceTime(300)
        .subscribe((blueScale) => {
            this.blueScaleAdjustment = blueScale;
            if (this.effectName) {
                this.loadImages();
            }
        });

        this.imageForm.controls.greenScale.valueChanges
        .debounceTime(300)
        .subscribe((greenScale) => {
            this.greenScaleAdjustment = greenScale;
            if (this.effectName) {
                this.loadImages();
            }
        });

        this.imageForm.controls.redScale.valueChanges
        .debounceTime(300)
        .subscribe((redScale) => {
            this.redScaleAdjustment = redScale;
            if (this.effectName) {
                this.loadImages();
            }
        });

        this.imageForm.controls.effectAdjustment.valueChanges
        .debounceTime(300)
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
                // APPLY EFECT HERE
                const runEffect = Filters.effects[this.effectName];
                runEffect(imageData, this.effectAdjustment, this.blueScaleAdjustment, this.greenScaleAdjustment, this.redScaleAdjustment);
                this.workingCanvasContext.putImageData(imageData, 0, 0, 0, 0, this.workingCanvas.width, this.workingCanvas.height);
            } else {
                this.workingCanvasContext.drawImage(this.imgElBefore, 0, 0, this.imgElAfter.width, this.imgElAfter.height);
            }
            res();
        });
    }

    private makeNewImageFile = (): Promise<any> => {
        return new Promise<any>((res, rej) => {
            this.imageAfterBase64 = this.workingCanvas.toDataURL('image/jpeg');
            const blob: Blob = this.dataURItoBlob(this.imageAfterBase64);
            this.fileAfter = new File([blob], `${this.fileBefore.name}-${Date.now()}`);
            res();
        });
    }

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


/*
* Built in canvas filters
*/
export const Filters = {
    effects: {},
    ensureRGBRange: (v): number => {
        if (isNaN(v)) {
            console.log('V is undefined', v)
        }
        if (v < 0) {
            return 0;
        } else if (v > 255) {
            return 255;
        }
        return v;
    }
};

Filters.effects['Gray'] = (imageData) => {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const v = 0.2126 * r  +  0.7152 * g  +  0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v
    }
};

Filters.effects['Light-Gray'] = (imageData) => {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const v = 0.2126 * r  +  0.7152 * g  +  0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i] += d[i];
      d[i + 1] += d[i + 1];
      d[i + 2] += d[i + 2];
    }
};

Filters.effects['Redscale'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    d[i] = Filters.ensureRGBRange( + adjustment);
    d[i + 1] += d[i + 1];
    d[i + 2] += d[i + 2]
  }
};

Filters.effects['Greenscale'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = d[i + 1];
    d[i] = d[i];
    d[i + 1] += Filters.ensureRGBRange(g + adjustment);
    d[i + 2] += d[i + 2];
  }
};

Filters.effects['Bluescale'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const b = d[i + 2];
    d[i] = d[i];
    d[i + 1] += d[i + 1];
    d[i + 2] += Filters.ensureRGBRange(b + adjustment);
  }
};

Filters.effects['Brightness'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    d[i] += Filters.ensureRGBRange(r + adjustment);
    d[i + 1] += Filters.ensureRGBRange(g + adjustment);
    d[i + 2] += Filters.ensureRGBRange(b + adjustment);
  }
};

Filters.effects['Manual'] = (imageData, adjustment, blueScaleAdjustment = 0, greenScaleAdjustment = 0, redScaleAdjustment = 0) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    d[i] += Filters.ensureRGBRange(r + redScaleAdjustment);
    d[i + 1] += Filters.ensureRGBRange(r + greenScaleAdjustment);
    d[i + 2] += Filters.ensureRGBRange(r + blueScaleAdjustment);
  }
};
