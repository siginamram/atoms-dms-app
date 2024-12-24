import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWritersClientsComponent } from './content-writers-clients.component';

describe('ContentWritersClientsComponent', () => {
  let component: ContentWritersClientsComponent;
  let fixture: ComponentFixture<ContentWritersClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentWritersClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentWritersClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
