import { TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MdButtonModule, MdCheckboxModule, MdChipsModule, MdIconModule, MdInputModule } from '@angular/material';

// Components
import { UserCardComponent } from './user-card/user-card.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserInsertComponent } from './user-insert/user-insert.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserLoginComponent } from './user-login/user-login.component';

// Modules
import { ConfirmationDialogModule } from './../shared/services/confirmation-dialog';
import { CustomPipesModule } from './../shared/pipes';
import { JsonStorageModule } from './../json-storage/json-storage.module';
import { UserRoutingModule } from './user-routing.module';
import { ValidatorModule } from './../shared/services/validator';

// Services
import { UserService } from './user.service';

describe('UserService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserCardComponent,
                UserEditComponent,
                UserFormComponent,
                UserInsertComponent,
                UserListComponent,
                UserLoginComponent,
            ],
            imports: [
                ConfirmationDialogModule,
                CustomPipesModule,
                FormsModule,
                JsonStorageModule,
                MdButtonModule,
                MdCheckboxModule,
                MdChipsModule,
                MdIconModule,
                MdInputModule,
                ReactiveFormsModule,
                RouterTestingModule,
                UserRoutingModule,
                ValidatorModule,
            ],
            providers: [
                UserService
            ]
        });
    });

    it('should be created', inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
    }));
});
