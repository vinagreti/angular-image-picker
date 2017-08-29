import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { UserFormComponent } from './../user-form/user-form.component';

// Modules
import { ConfirmationDialogModule } from './../../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../../json-storage/json-storage.module';
import { ValidatorModule } from './../../shared/services/validator';

// Services
import { UserService } from './../user.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          UserFormComponent,
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
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
