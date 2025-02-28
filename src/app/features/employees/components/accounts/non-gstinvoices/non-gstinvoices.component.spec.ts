import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonGstinvoicesComponent } from './non-gstinvoices.component';

describe('NonGstinvoicesComponent', () => {
  let component: NonGstinvoicesComponent;
  let fixture: ComponentFixture<NonGstinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonGstinvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonGstinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
