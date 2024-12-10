import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteGenerationDocComponent } from './quote-generation-doc.component';

describe('QuoteGenerationDocComponent', () => {
  let component: QuoteGenerationDocComponent;
  let fixture: ComponentFixture<QuoteGenerationDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteGenerationDocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuoteGenerationDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
