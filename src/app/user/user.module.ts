import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatChipsModule, MatIconModule, MatInputModule } from '@angular/material';

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
import { AngularImagePickerModule } from './../angular-image-picker/angular-image-picker.module';


// Services
import { UserService } from './user.service';

@NgModule({
    declarations: [
        UserCardComponent,
        UserEditComponent,
        UserFormComponent,
        UserInsertComponent,
        UserListComponent,
        UserLoginComponent,
    ],
    imports: [
        AngularImagePickerModule,
        CommonModule,
        ConfirmationDialogModule,
        CustomPipesModule,
        FormsModule,
        JsonStorageModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        UserRoutingModule,
        ValidatorModule,
    ]
})
export class UserModule { }
