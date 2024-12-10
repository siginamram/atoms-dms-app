import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesConvertedListComponent } from './sales-converted-list.component';

describe('SalesConvertedListComponent', () => {
  let component: SalesConvertedListComponent;
  let fixture: ComponentFixture<SalesConvertedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesConvertedListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesConvertedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
