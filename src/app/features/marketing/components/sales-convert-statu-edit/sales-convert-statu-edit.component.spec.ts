import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesConvertStatuEditComponent } from './sales-convert-statu-edit.component';

describe('SalesConvertStatuEditComponent', () => {
  let component: SalesConvertStatuEditComponent;
  let fixture: ComponentFixture<SalesConvertStatuEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesConvertStatuEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesConvertStatuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
