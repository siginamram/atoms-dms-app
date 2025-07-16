import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrapherOperationsComponent } from './photo-grapher-operations.component';

describe('PhotoGrapherOperationsComponent', () => {
  let component: PhotoGrapherOperationsComponent;
  let fixture: ComponentFixture<PhotoGrapherOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrapherOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoGrapherOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
