import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrapherScheduleMeetPopupComponent } from './photo-grapher-schedule-meet-popup.component';

describe('PhotoGrapherScheduleMeetPopupComponent', () => {
  let component: PhotoGrapherScheduleMeetPopupComponent;
  let fixture: ComponentFixture<PhotoGrapherScheduleMeetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrapherScheduleMeetPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoGrapherScheduleMeetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
