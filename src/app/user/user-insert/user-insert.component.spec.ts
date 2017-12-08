import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { UserFormComponent } from './../user-form/user-form.component';
import { UserInsertComponent } from './user-insert.component';

// Modules
import { ConfirmationDialogModule } from './../../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../../json-storage/json-storage.module';
import { ValidatorModule } from './../../shared/services/validator';

// Services
import { UserService } from './../user.service';

describe('UserInsertComponent', () => {
  let component: UserInsertComponent;
  let fixture: ComponentFixture<UserInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          UserFormComponent,
          UserInsertComponent
      ],
      imports: [
          BrowserAnimationsModule,
          ConfirmationDialogModule,
          JsonStorageModule,
          MatButtonModule,
          MatCheckboxModule,
          MatIconModule,
          MatInputModule,
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
    fixture = TestBed.createComponent(UserInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
