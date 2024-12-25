import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditorClientsComponent } from './video-editor-clients.component';

describe('VideoEditorClientsComponent', () => {
  let component: VideoEditorClientsComponent;
  let fixture: ComponentFixture<VideoEditorClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditorClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEditorClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
