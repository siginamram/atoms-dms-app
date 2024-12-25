import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterDesignerOperationsComponent } from './poster-designer-operations.component';

describe('PosterDesignerOperationsComponent', () => {
  let component: PosterDesignerOperationsComponent;
  let fixture: ComponentFixture<PosterDesignerOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosterDesignerOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterDesignerOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
