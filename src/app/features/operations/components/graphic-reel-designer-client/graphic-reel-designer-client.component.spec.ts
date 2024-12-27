import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicReelDesignerClientComponent } from './graphic-reel-designer-client.component';

describe('GraphicReelDesignerClientComponent', () => {
  let component: GraphicReelDesignerClientComponent;
  let fixture: ComponentFixture<GraphicReelDesignerClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicReelDesignerClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicReelDesignerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
