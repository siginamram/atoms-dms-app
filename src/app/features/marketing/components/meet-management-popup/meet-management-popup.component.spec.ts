import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetManagementPopupComponent } from './meet-management-popup.component';

describe('MeetManagementPopupComponent', () => {
  let component: MeetManagementPopupComponent;
  let fixture: ComponentFixture<MeetManagementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetManagementPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetManagementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
