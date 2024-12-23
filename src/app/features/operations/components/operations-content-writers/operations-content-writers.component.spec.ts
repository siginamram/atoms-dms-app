import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsContentWritersComponent } from './operations-content-writers.component';

describe('OperationsContentWritersComponent', () => {
  let component: OperationsContentWritersComponent;
  let fixture: ComponentFixture<OperationsContentWritersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsContentWritersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationsContentWritersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
