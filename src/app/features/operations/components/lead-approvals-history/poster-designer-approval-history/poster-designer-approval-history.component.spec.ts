import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterDesignerApprovalHistoryComponent } from './poster-designer-approval-history.component';

describe('PosterDesignerApprovalHistoryComponent', () => {
  let component: PosterDesignerApprovalHistoryComponent;
  let fixture: ComponentFixture<PosterDesignerApprovalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosterDesignerApprovalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterDesignerApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
