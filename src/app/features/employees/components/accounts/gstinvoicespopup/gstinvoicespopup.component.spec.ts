import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstinvoicespopupComponent } from './gstinvoicespopup.component';

describe('GstinvoicespopupComponent', () => {
  let component: GstinvoicespopupComponent;
  let fixture: ComponentFixture<GstinvoicespopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstinvoicespopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstinvoicespopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
