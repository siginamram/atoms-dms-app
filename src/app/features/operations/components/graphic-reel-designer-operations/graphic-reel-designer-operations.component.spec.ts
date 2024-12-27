import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicReelDesignerOperationsComponent } from './graphic-reel-designer-operations.component';

describe('GraphicReelDesignerOperationsComponent', () => {
  let component: GraphicReelDesignerOperationsComponent;
  let fixture: ComponentFixture<GraphicReelDesignerOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicReelDesignerOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicReelDesignerOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
