import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStatusApprovalsComponent } from './edit-status-approvals.component';

describe('EditStatusApprovalsComponent', () => {
  let component: EditStatusApprovalsComponent;
  let fixture: ComponentFixture<EditStatusApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStatusApprovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStatusApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
