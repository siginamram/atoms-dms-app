import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadmanagementaddComponent } from './leadmanagementadd.component';

describe('LeadmanagementaddComponent', () => {
  let component: LeadmanagementaddComponent;
  let fixture: ComponentFixture<LeadmanagementaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadmanagementaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadmanagementaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
