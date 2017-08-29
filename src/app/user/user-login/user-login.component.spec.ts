import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { UserLoginComponent } from './user-login.component';

// Modules
import { ConfirmationDialogModule } from './../../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../../json-storage/json-storage.module';

// Services
import { UserService } from './../user.service';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          UserLoginComponent
      ],
      imports: [
          BrowserAnimationsModule,
          ConfirmationDialogModule,
          JsonStorageModule,
          MdInputModule,
          RouterTestingModule,
          ReactiveFormsModule
      ],
      providers: [
          UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
