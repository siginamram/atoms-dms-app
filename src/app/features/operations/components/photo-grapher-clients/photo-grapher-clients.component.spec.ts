import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrapherClientsComponent } from './photo-grapher-clients.component';

describe('PhotoGrapherClientsComponent', () => {
  let component: PhotoGrapherClientsComponent;
  let fixture: ComponentFixture<PhotoGrapherClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrapherClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoGrapherClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
