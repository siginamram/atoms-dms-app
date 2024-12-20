import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteGenerationDownloadComponent } from './quote-generation-download.component';

describe('QuoteGenerationDownloadComponent', () => {
  let component: QuoteGenerationDownloadComponent;
  let fixture: ComponentFixture<QuoteGenerationDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteGenerationDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuoteGenerationDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
