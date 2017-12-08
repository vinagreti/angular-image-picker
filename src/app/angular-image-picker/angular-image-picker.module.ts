import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatProgressBarModule, MatSliderModule } from '@angular/material';
import { AngularImagePickerComponent } from './angular-image-picker.component';
import { AngularImagePickerImageComponent } from './angular-image-picker-image/angular-image-picker-image.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatProgressBarModule,
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
