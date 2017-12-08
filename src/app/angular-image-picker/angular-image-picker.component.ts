import { Component, ViewChild, OnInit, Input, Output, forwardRef, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Image } from './../image'
import { Media } from './media.model'
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularImagePickerImageComponent } from './angular-image-picker-image/angular-image-picker-image.component';

// Used to extend ngForms functions
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngularImagePickerComponent),
    multi: true
};

@Component({
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ],
  selector: 'tzd-angular-image-picker',
  styleUrls: ['./angular-image-picker.component.scss'],
  templateUrl: './angular-image-picker.component.html',
})
export class AngularImagePickerComponent implements OnInit {

  private manipulationLayerObserver;
  private initialModelImages;

  @Input() debug: boolean;
  @Input() multiple = false;
  @Input() type: 'raw' | 'blob' = 'raw';
  @ViewChild('fileUpload') fileUpload;

  // The image-picker elements array images generated by the component
  @ViewChildren(AngularImagePickerImageComponent) manipulatedImages: QueryList<AngularImagePickerImageComponent>;

  /*
  ** ngModel compatibility
  ** Used to two way data bind using [(ngModel)]
  */
  // The internal data model
  private images: File | FileList | string | string[];
  files: File | FileList | string | string[];

  // use file input or show image
  changeImageMode: boolean;

  // Used to trigger change event
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  // Get accessor
  get value(): File | FileList | string | string[] {
    return this.images;
  };

  // Set accessor including call the onchange callback
  set value(v: File | FileList | string | string[]) {
    if (v !== this.images) {
      this.images = v;
      this.onChangeCallback(v);
    }
  }

  constructor() { }

  ngOnInit() {
    this.resetComponent();
  }

  // Placeholders for the callbacks which are later provided by the Control Value Accessor
  private onTouchedCallback = () => {};
  // Placeholders for the callbacks which are later provided by the Control Value Accessor
  private onChangeCallback = (a: any) => {};

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.value) {
      if (this.multiple) {
        this.initialModelImages = Array.isArray(value) ? value : [value];
      }
      this.initialModelImages = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  onValueChanged(event: any) {
    this.value = event.toString();
  }

  /*
  ** Class Methods
  ** Private and public methods used by the component
  */

  onClose(images?) {
    this.resetComponent();
    this.changeImageMode = false;
    this.close.emit(images);
  }

  // this methos is called by the html when the input file changes
  updateFilesToLoad($event): void {
    this.files = $event.target.files;
    this.refreshManipulationLayerObserver();
  }

  private resetComponent() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = '';
    }
    this.files = undefined;
    this.value = this.initialModelImages || undefined;
  }

  private refreshValue = () => {
    let images;

    const manipulatedImages = this.manipulatedImages.toArray();

    if (this.type === 'blob') {
      if (this.multiple) {
        images = manipulatedImages.map(image => image.imageAfterBase64);
      } else {
        images = manipulatedImages[0].imageAfterBase64;
      }
    } else {
      if (this.multiple) {
        images = manipulatedImages.map(image => image.fileAfter);
      } else {
        images = manipulatedImages[0].fileAfter;
      }
    }
    this.value = images;
  }

  private refreshManipulationLayerObserver() {
    if (this.manipulatedImages) {
      if (this.manipulationLayerObserver) {
        this.manipulationLayerObserver.unsubscribe();
      }
      this.manipulationLayerObserver = this.manipulatedImages.changes.subscribe(() => {
        this.manipulatedImages.toArray().forEach((image: AngularImagePickerImageComponent) => {
          image.value.subscribe(this.refreshValue);
        });
      });
    }
  }

}
