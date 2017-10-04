import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdIconModule, MdSidenavModule, MdToolbarModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Global Components
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './static-pages/page-not-found.component';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Global Services
import { UserService } from './user';

// Globla Modules
import { ConfirmationDialogModule } from './shared/services/confirmation-dialog';
import { GuardModule } from './shared/guard';
import { JsonStorageModule } from './json-storage/json-storage.module';

// Globals
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ConfirmationDialogModule,
    GuardModule,
    JsonStorageModule,
    HttpModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdToolbarModule,
  ],
  providers: [
    UserService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
