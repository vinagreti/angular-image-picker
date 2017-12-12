import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularImagePickerComponent } from './angular-image-picker.component';

describe('AngularImagePickerComponent', () => {
  let component: AngularImagePickerComponent;
  let fixture: ComponentFixture<AngularImagePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularImagePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularImagePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
