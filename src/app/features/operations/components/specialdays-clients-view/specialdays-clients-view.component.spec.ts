import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialdaysClientsViewComponent } from './specialdays-clients-view.component';

describe('SpecialdaysClientsViewComponent', () => {
  let component: SpecialdaysClientsViewComponent;
  let fixture: ComponentFixture<SpecialdaysClientsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialdaysClientsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialdaysClientsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
