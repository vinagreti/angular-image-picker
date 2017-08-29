import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmationDialogModule } from './../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../json-storage/json-storage.module';

import { HomeComponent } from './home.component';
import { DefaultAdminUser, UserService } from './../user';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            imports: [
                ConfirmationDialogModule,
                JsonStorageModule,
                RouterTestingModule
            ],
            providers: [
                UserService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should show loggedBlock if logged', inject([UserService], (userService: UserService) => {
        const fixture = TestBed.createComponent(HomeComponent);
        userService.user.subscribe(user => {
            if(user.id){
                fixture.detectChanges();
                let compiled = fixture.debugElement.nativeElement;
                expect(compiled.querySelector('.not-logged-block')).toBeTruthy();
            }
        })


    }));

    it('should show notLoggedBlock if not logged', inject([UserService], (userService: UserService) => {
        const fixture = TestBed.createComponent(HomeComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.not-logged-block')).toBeTruthy();
    }));
});
