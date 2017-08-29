import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdDialogModule } from '@angular/material';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdDialogModule,
  ],
  declarations: [
      ConfirmationDialogComponent
  ],
  entryComponents: [
      ConfirmationDialogComponent
  ],
  providers: [
      ConfirmationDialogService
  ]
})
export class ConfirmationDialogModule { }
