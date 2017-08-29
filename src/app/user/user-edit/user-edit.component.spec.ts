import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { UserFormComponent } from './../user-form/user-form.component';
import { UserEditComponent } from './user-edit.component';

// Modules
import { ConfirmationDialogModule } from './../../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../../json-storage/json-storage.module';
import { ValidatorModule } from './../../shared/services/validator';

// Services
import { UserService } from './../user.service';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          UserFormComponent,
          UserEditComponent
      ],
      imports: [
          BrowserAnimationsModule,
          ConfirmationDialogModule,
          JsonStorageModule,
          MdButtonModule,
          MdCheckboxModule,
          MdIconModule,
          MdInputModule,
          ReactiveFormsModule,
          RouterTestingModule,
          ValidatorModule
      ],
      providers: [
          UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
