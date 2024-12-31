import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditorApprovalComponent } from './video-editor-approval.component';

describe('VideoEditorApprovalComponent', () => {
  let component: VideoEditorApprovalComponent;
  let fixture: ComponentFixture<VideoEditorApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditorApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEditorApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
