import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVideosEmergrncyRequestComponent } from './client-videos-emergrncy-request.component';

describe('ClientVideosEmergrncyRequestComponent', () => {
  let component: ClientVideosEmergrncyRequestComponent;
  let fixture: ComponentFixture<ClientVideosEmergrncyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientVideosEmergrncyRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientVideosEmergrncyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
