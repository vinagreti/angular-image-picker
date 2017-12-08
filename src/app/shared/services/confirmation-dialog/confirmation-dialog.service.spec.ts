import { TestBed, inject } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';

import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule
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
