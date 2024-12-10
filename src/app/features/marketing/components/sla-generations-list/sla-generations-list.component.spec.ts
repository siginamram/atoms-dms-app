import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaGenerationsListComponent } from './sla-generations-list.component';

describe('SlaGenerationsListComponent', () => {
  let component: SlaGenerationsListComponent;
  let fixture: ComponentFixture<SlaGenerationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaGenerationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlaGenerationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
