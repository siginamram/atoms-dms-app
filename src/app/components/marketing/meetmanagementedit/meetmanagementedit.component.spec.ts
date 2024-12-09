import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetmanagementeditComponent } from './meetmanagementedit.component';

describe('MeetmanagementeditComponent', () => {
  let component: MeetmanagementeditComponent;
  let fixture: ComponentFixture<MeetmanagementeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetmanagementeditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetmanagementeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
