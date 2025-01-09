import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdDashboardComponent } from './gd-dashboard.component';

describe('GdDashboardComponent', () => {
  let component: GdDashboardComponent;
  let fixture: ComponentFixture<GdDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GdDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
