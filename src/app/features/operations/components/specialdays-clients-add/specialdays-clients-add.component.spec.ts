import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialdaysClientsAddComponent } from './specialdays-clients-add.component';

describe('SpecialdaysClientsAddComponent', () => {
  let component: SpecialdaysClientsAddComponent;
  let fixture: ComponentFixture<SpecialdaysClientsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialdaysClientsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialdaysClientsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
