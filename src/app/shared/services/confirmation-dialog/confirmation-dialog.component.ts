import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

    message: string;

    constructor(
        public dialogRef: MdDialogRef<ConfirmationDialogComponent>
    ){}

    confirm = (option: boolean) => {
        this.dialogRef.close(option);
    }
}
