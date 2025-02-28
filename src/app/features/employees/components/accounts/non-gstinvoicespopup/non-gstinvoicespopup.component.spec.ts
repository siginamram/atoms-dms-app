import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonGstinvoicespopupComponent } from './non-gstinvoicespopup.component';

describe('NonGstinvoicespopupComponent', () => {
  let component: NonGstinvoicespopupComponent;
  let fixture: ComponentFixture<NonGstinvoicespopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonGstinvoicespopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonGstinvoicespopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
