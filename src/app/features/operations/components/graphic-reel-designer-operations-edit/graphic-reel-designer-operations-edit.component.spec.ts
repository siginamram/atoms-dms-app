import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicReelDesignerOperationsEditComponent } from './graphic-reel-designer-operations-edit.component';

describe('GraphicReelDesignerOperationsEditComponent', () => {
  let component: GraphicReelDesignerOperationsEditComponent;
  let fixture: ComponentFixture<GraphicReelDesignerOperationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicReelDesignerOperationsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicReelDesignerOperationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
