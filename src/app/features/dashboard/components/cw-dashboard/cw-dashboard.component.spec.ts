import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwDashboardComponent } from './cw-dashboard.component';

describe('CwDashboardComponent', () => {
  let component: CwDashboardComponent;
  let fixture: ComponentFixture<CwDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CwDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CwDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
