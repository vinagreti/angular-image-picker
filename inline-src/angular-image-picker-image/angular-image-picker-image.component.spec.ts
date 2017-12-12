import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularImagePickerImageComponent } from './angular-image-picker-image.component';

describe('AngularImagePickerImageComponent', () => {
  let component: AngularImagePickerImageComponent;
  let fixture: ComponentFixture<AngularImagePickerImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularImagePickerImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularImagePickerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
