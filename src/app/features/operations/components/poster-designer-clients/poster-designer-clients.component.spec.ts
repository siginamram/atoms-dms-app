import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterDesignerClientsComponent } from './poster-designer-clients.component';

describe('PosterDesignerClientsComponent', () => {
  let component: PosterDesignerClientsComponent;
  let fixture: ComponentFixture<PosterDesignerClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosterDesignerClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosterDesignerClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
