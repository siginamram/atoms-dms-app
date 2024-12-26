import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWritersOperationsEditComponent } from './content-writers-operations-edit.component';

describe('ContentWritersOperationsEditComponent', () => {
  let component: ContentWritersOperationsEditComponent;
  let fixture: ComponentFixture<ContentWritersOperationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentWritersOperationsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentWritersOperationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
