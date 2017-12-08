import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

// Components
import { UserCardComponent } from './user-card.component';

// Modules
import { ConfirmationDialogModule } from './../../shared/services/confirmation-dialog';
import { JsonStorageModule } from './../../json-storage/json-storage.module';

// Services
import { UserService } from './../';


describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          UserCardComponent
      ],
      imports: [
          ConfirmationDialogModule,
          JsonStorageModule,
          MatChipsModule,
          RouterTestingModule
      ],
      providers: [
          UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
