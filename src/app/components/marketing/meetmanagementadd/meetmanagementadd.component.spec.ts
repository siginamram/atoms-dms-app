import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetmanagementaddComponent } from './meetmanagementadd.component';

describe('MeetmanagementaddComponent', () => {
  let component: MeetmanagementaddComponent;
  let fixture: ComponentFixture<MeetmanagementaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetmanagementaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetmanagementaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
