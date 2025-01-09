import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdDashboardComponent } from './pd-dashboard.component';

describe('PdDashboardComponent', () => {
  let component: PdDashboardComponent;
  let fixture: ComponentFixture<PdDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
