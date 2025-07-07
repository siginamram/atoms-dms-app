import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalTaskViewComponent } from './additional-task-view.component';

describe('AdditionalTaskViewComponent', () => {
  let component: AdditionalTaskViewComponent;
  let fixture: ComponentFixture<AdditionalTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalTaskViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
