import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicReelsApprovalHistoryComponent } from './graphic-reels-approval-history.component';

describe('GraphicReelsApprovalHistoryComponent', () => {
  let component: GraphicReelsApprovalHistoryComponent;
  let fixture: ComponentFixture<GraphicReelsApprovalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicReelsApprovalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicReelsApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
