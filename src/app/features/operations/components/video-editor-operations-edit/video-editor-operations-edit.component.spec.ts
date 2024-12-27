import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditorOperationsEditComponent } from './video-editor-operations-edit.component';

describe('VideoEditorOperationsEditComponent', () => {
  let component: VideoEditorOperationsEditComponent;
  let fixture: ComponentFixture<VideoEditorOperationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditorOperationsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEditorOperationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
