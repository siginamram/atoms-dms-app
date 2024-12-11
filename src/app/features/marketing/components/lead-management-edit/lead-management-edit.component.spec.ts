import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadManagementEditComponent } from './lead-management-edit.component';

describe('LeadManagementEditComponent', () => {
  let component: LeadManagementEditComponent;
  let fixture: ComponentFixture<LeadManagementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadManagementEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
