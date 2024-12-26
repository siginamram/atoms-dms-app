import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientEmergencyRequestComponent } from './add-client-emergency-request.component';

describe('AddClientEmergencyRequestComponent', () => {
  let component: AddClientEmergencyRequestComponent;
  let fixture: ComponentFixture<AddClientEmergencyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClientEmergencyRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClientEmergencyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
