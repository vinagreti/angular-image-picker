import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './static-pages/page-not-found.component';

export const appRoutes: Routes = [

  { path: '', loadChildren: './image/image.module#ImageModule' },

  { path: 'home',  component: HomeComponent},

  { path: 'user', loadChildren: './user/user.module#UserModule' },

  { path: 'image', loadChildren: './image/image.module#ImageModule' },

  { path: 'attachments', loadChildren: './attachments/attachments.module#AttachmentsModule' },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [
  ]
})

export class AppRoutingModule { }
