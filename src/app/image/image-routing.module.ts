import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageComponent } from './image.component';
import { ImageCenterComponent } from './image-center.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';

const _authRoutes: Routes = [

  { path: '', component: ImageCenterComponent,
    children: [
	  	{ path: 'add', component: ImageDetailComponent },
	  	{ path: ':id/detail', component: ImageDetailComponent },
	  	{ path: '', component: ImageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(_authRoutes)],
  exports: [RouterModule],
})

export class ImageRoutingModule { }
