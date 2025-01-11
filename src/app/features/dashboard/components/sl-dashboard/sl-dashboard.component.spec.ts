import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlDashboardComponent } from './sl-dashboard.component';

describe('SlDashboardComponent', () => {
  let component: SlDashboardComponent;
  let fixture: ComponentFixture<SlDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
