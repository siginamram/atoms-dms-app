import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetmanagementlistComponent } from './meetmanagementlist.component';

describe('MeetmanagementlistComponent', () => {
  let component: MeetmanagementlistComponent;
  let fixture: ComponentFixture<MeetmanagementlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetmanagementlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetmanagementlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
