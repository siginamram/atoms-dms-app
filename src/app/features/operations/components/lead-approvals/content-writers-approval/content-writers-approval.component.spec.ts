import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWritersApprovalComponent } from './content-writers-approval.component';

describe('ContentWritersApprovalComponent', () => {
  let component: ContentWritersApprovalComponent;
  let fixture: ComponentFixture<ContentWritersApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentWritersApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentWritersApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
