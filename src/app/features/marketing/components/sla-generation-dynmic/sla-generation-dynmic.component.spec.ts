import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaGenerationDynmicComponent } from './sla-generation-dynmic.component';

describe('SlaGenerationDynmicComponent', () => {
  let component: SlaGenerationDynmicComponent;
  let fixture: ComponentFixture<SlaGenerationDynmicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaGenerationDynmicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlaGenerationDynmicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
