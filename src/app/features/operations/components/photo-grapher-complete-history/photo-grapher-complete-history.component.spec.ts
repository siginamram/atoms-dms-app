import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrapherCompleteHistoryComponent } from './photo-grapher-complete-history.component';

describe('PhotoGrapherCompleteHistoryComponent', () => {
  let component: PhotoGrapherCompleteHistoryComponent;
  let fixture: ComponentFixture<PhotoGrapherCompleteHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrapherCompleteHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoGrapherCompleteHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
