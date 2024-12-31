import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadApprovalsComponent } from './lead-approvals.component';

describe('LeadApprovalsComponent', () => {
  let component: LeadApprovalsComponent;
  let fixture: ComponentFixture<LeadApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadApprovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
