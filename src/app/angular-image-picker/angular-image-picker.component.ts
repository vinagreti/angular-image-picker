import { Component, OnInit, Input, Output, forwardRef, EventEmitter, ViewChildren, QueryList } from '@angular/core';
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

  @Input('multiple') multiple = false;
  @Input('type') type: 'raw' | 'blob' = 'raw';

  // The image-picker elements array of every image
  @ViewChildren(AngularImagePickerImageComponent) manipulatedImages: QueryList<AngularImagePickerImageComponent>;

  /*
  ** ngModel compatibility
  ** Used to two way data bind using [(ngModel)]
  */
  // The internal data model
  private images: File | FileList | string | string[];
  files: File | FileList;

  // Used to trigger change event
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  // Get accessor
  get value(): File | FileList | string | string[] {
    return this.images;
  };

  // Set accessor including call the onchange callback
  set value(v: File | FileList | string | string[]) {
    if (v !== this.images) {
      this.images = v;
      this.onChangeCallback(v);
      this.change.emit(v);
    }
  }

  constructor() { }

  ngOnInit() {}

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
    if (value !== this.images) {
      this.images = value;
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

  // this methos is called by the html when the input file changes
  updateFilesToLoad(): void {
    this.files = (<HTMLInputElement>document.getElementById('files')).files;
    this.manipulatedImages.changes.subscribe(() => {
      this.manipulatedImages.toArray().forEach((image: AngularImagePickerImageComponent) => {
        image.value.subscribe(this.refreshValue);
      });
    });
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

}
