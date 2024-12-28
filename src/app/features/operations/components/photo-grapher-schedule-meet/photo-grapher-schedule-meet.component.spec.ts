import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrapherScheduleMeetComponent } from './photo-grapher-schedule-meet.component';

describe('PhotoGrapherScheduleMeetComponent', () => {
  let component: PhotoGrapherScheduleMeetComponent;
  let fixture: ComponentFixture<PhotoGrapherScheduleMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrapherScheduleMeetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoGrapherScheduleMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
