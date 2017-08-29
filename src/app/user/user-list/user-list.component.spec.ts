import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdChipsModule, MdIconModule, MdInputModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { UserCardComponent } from './../user-card/user-card.component';
import { UserListComponent } from './user-list.component';

// Modules
import { CustomPipesModule } from './../../shared/pipes';
import { ConfirmationDialogModule } from './../../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../../json-storage/json-storage.module';

// Services
import { UserService } from './../user.service';


describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserCardComponent,
                UserListComponent
            ],
            imports: [
                ConfirmationDialogModule,
                CustomPipesModule,
                FormsModule,
                JsonStorageModule,
                MdChipsModule,
                MdIconModule,
                MdInputModule,
                RouterTestingModule
            ],
            providers: [
                UserService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
