import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmaDashboardComponent } from './dma-dashboard.component';

describe('DmaDashboardComponent', () => {
  let component: DmaDashboardComponent;
  let fixture: ComponentFixture<DmaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
