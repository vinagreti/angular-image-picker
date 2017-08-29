import { TestBed, inject } from '@angular/core/testing';
import { MdDialogModule } from '@angular/material';

import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MdDialogModule
            ],
            providers: [
                ConfirmationDialogService
            ]
        });
    });

    it('should be created', inject([ConfirmationDialogService], (service: ConfirmationDialogService) => {
        expect(service).toBeTruthy();
    }));
});
