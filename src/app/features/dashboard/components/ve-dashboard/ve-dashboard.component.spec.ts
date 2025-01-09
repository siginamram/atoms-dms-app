import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeDashboardComponent } from './ve-dashboard.component';

describe('VeDashboardComponent', () => {
  let component: VeDashboardComponent;
  let fixture: ComponentFixture<VeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
