import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditorApprovalHistoryComponent } from './video-editor-approval-history.component';

describe('VideoEditorApprovalHistoryComponent', () => {
  let component: VideoEditorApprovalHistoryComponent;
  let fixture: ComponentFixture<VideoEditorApprovalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditorApprovalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEditorApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
