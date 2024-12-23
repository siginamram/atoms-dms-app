import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsOnboardingComponent } from './clients-onboarding.component';

describe('ClientsOnboardingComponent', () => {
  let component: ClientsOnboardingComponent;
  let fixture: ComponentFixture<ClientsOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
