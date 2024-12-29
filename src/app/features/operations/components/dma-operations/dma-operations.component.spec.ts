import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmaOperationsComponent } from './dma-operations.component';

describe('DmaOperationsComponent', () => {
  let component: DmaOperationsComponent;
  let fixture: ComponentFixture<DmaOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmaOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmaOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
