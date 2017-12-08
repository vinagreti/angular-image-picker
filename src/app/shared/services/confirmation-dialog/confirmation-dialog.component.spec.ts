import { NgModule, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

// Helper class
class MatDialogRefMock {
}

describe('ConfirmationDialogComponent', () => {
    let component: ConfirmationDialogComponent;
    let fixture: ComponentFixture<ConfirmationDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationDialogComponent
            ],
            imports: [
                MatButtonModule,
                MatDialogModule,
            ],
            providers: [
                ConfirmationDialogService,
                { provide: MatDialogRef, useClass: MatDialogRefMock }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
