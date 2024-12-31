import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicReelsDesignerApprovalComponent } from './graphic-reels-designer-approval.component';

describe('GraphicReelsDesignerApprovalComponent', () => {
  let component: GraphicReelsDesignerApprovalComponent;
  let fixture: ComponentFixture<GraphicReelsDesignerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicReelsDesignerApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicReelsDesignerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
