import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmaClientsComponent } from './dma-clients.component';

describe('DmaClientsComponent', () => {
  let component: DmaClientsComponent;
  let fixture: ComponentFixture<DmaClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmaClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmaClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
