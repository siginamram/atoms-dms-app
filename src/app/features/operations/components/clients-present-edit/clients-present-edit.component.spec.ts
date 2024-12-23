import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsPresentEditComponent } from './clients-present-edit.component';

describe('ClientsPresentEditComponent', () => {
  let component: ClientsPresentEditComponent;
  let fixture: ComponentFixture<ClientsPresentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsPresentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsPresentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
