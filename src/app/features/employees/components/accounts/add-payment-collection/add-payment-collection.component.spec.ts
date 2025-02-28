import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentCollectionComponent } from './add-payment-collection.component';

describe('AddPaymentCollectionComponent', () => {
  let component: AddPaymentCollectionComponent;
  let fixture: ComponentFixture<AddPaymentCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPaymentCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
