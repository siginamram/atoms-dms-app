import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadApprovalHistoryComponent } from './lead-approval-history.component';

describe('LeadApprovalHistoryComponent', () => {
  let component: LeadApprovalHistoryComponent;
  let fixture: ComponentFixture<LeadApprovalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadApprovalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
