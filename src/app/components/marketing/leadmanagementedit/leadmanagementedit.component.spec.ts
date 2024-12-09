import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadmanagementeditComponent } from './leadmanagementedit.component';

describe('LeadmanagementeditComponent', () => {
  let component: LeadmanagementeditComponent;
  let fixture: ComponentFixture<LeadmanagementeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadmanagementeditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadmanagementeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
