import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstinvoicesComponent } from './gstinvoices.component';

describe('GstinvoicesComponent', () => {
  let component: GstinvoicesComponent;
  let fixture: ComponentFixture<GstinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstinvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
