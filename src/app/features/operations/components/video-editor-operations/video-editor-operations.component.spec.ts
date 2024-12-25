import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditorOperationsComponent } from './video-editor-operations.component';

describe('VideoEditorOperationsComponent', () => {
  let component: VideoEditorOperationsComponent;
  let fixture: ComponentFixture<VideoEditorOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditorOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEditorOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
