import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteGenerationAddComponent } from './quote-generation-add.component';

describe('QuoteGenerationAddComponent', () => {
  let component: QuoteGenerationAddComponent;
  let fixture: ComponentFixture<QuoteGenerationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteGenerationAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuoteGenerationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
