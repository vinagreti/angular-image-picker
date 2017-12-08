import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { ImageComponent } from './image.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { ImageRoutingModule } from './image-routing.module';
import { ImageCenterComponent } from './image-center.component';
import { AngularImagePickerModule } from './../angular-image-picker';

@NgModule({
  imports: [
    AngularImagePickerModule,
    CommonModule,
    ImageRoutingModule,
    MatButtonModule,
  ],
  declarations: [
  	ImageComponent,
  	ImageDetailComponent,
  	ImageCenterComponent
  ]
})

export class ImageModule { }
