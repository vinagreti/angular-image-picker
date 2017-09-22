import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdIconModule, MdProgressBarModule, MdSliderModule } from '@angular/material';
import { AngularImagePickerComponent } from './angular-image-picker.component';
import { AngularImagePickerImageComponent } from './angular-image-picker-image/angular-image-picker-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdIconModule,
    MdSliderModule,
    MdProgressBarModule,
  ],
  declarations: [
    AngularImagePickerComponent,
    AngularImagePickerImageComponent
  ],
  exports: [
    AngularImagePickerComponent
  ],
  entryComponents: [
    AngularImagePickerComponent
  ],
  providers: [
  ]
})
export class AngularImagePickerModule { }
