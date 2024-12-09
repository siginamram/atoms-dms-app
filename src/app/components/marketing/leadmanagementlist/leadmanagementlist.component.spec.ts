import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadmanagementlistComponent } from './leadmanagementlist.component';

describe('LeadmanagementlistComponent', () => {
  let component: LeadmanagementlistComponent;
  let fixture: ComponentFixture<LeadmanagementlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadmanagementlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadmanagementlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
