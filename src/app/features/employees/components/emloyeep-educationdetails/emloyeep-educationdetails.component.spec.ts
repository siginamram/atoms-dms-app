import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmloyeepEducationdetailsComponent } from './emloyeep-educationdetails.component';

describe('EmloyeepEducationdetailsComponent', () => {
  let component: EmloyeepEducationdetailsComponent;
  let fixture: ComponentFixture<EmloyeepEducationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmloyeepEducationdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmloyeepEducationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
