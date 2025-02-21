import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicdetaislAddemployeeComponent } from './basicdetaisl-addemployee.component';

describe('BasicdetaislAddemployeeComponent', () => {
  let component: BasicdetaislAddemployeeComponent;
  let fixture: ComponentFixture<BasicdetaislAddemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicdetaislAddemployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicdetaislAddemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
