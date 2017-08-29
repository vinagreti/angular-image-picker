import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {

    constructor(
        private dialog: MdDialog,
    ) { }

    private openDialog = (message): MdDialogRef<ConfirmationDialogComponent> => {
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
        });
        dialogRef.componentInstance.message = message;
        return dialogRef;
    }

    confirm = (message: string): Promise<boolean> => {
        return this.openDialog(message)
        .afterClosed()
        .toPromise()
    }

}
