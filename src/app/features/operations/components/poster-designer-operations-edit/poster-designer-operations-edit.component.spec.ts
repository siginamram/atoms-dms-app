import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterDesignerOperationsEditComponent } from './poster-designer-operations-edit.component';

describe('PosterDesignerOperationsEditComponent', () => {
  let component: PosterDesignerOperationsEditComponent;
  let fixture: ComponentFixture<PosterDesignerOperationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosterDesignerOperationsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterDesignerOperationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
