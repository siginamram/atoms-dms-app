import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmaOperationsEditComponent } from './dma-operations-edit.component';

describe('DmaOperationsEditComponent', () => {
  let component: DmaOperationsEditComponent;
  let fixture: ComponentFixture<DmaOperationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmaOperationsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmaOperationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
