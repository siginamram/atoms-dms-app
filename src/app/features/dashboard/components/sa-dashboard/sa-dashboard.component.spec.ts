import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaDashboardComponent } from './sa-dashboard.component';

describe('SaDashboardComponent', () => {
  let component: SaDashboardComponent;
  let fixture: ComponentFixture<SaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
