import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWritersApprovalHistoryComponent } from './content-writers-approval-history.component';

describe('ContentWritersApprovalHistoryComponent', () => {
  let component: ContentWritersApprovalHistoryComponent;
  let fixture: ComponentFixture<ContentWritersApprovalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentWritersApprovalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentWritersApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
