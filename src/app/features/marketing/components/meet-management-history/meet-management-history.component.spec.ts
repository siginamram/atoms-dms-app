import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetManagementHistoryComponent } from './meet-management-history.component';

describe('MeetManagementHistoryComponent', () => {
  let component: MeetManagementHistoryComponent;
  let fixture: ComponentFixture<MeetManagementHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetManagementHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetManagementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
