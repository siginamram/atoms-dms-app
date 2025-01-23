import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWritersCalendarExportComponent } from './content-writers-calendar-export.component';

describe('ContentWritersCalendarExportComponent', () => {
  let component: ContentWritersCalendarExportComponent;
  let fixture: ComponentFixture<ContentWritersCalendarExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentWritersCalendarExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentWritersCalendarExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
