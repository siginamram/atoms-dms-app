import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaGenerationAddComponent } from './sla-generation-add.component';

describe('SlaGenerationAddComponent', () => {
  let component: SlaGenerationAddComponent;
  let fixture: ComponentFixture<SlaGenerationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaGenerationAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlaGenerationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
