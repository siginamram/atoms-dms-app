import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterDesignerApprovalComponent } from './poster-designer-approval.component';

describe('PosterDesignerApprovalComponent', () => {
  let component: PosterDesignerApprovalComponent;
  let fixture: ComponentFixture<PosterDesignerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosterDesignerApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterDesignerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
