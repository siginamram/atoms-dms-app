import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCampaignTrakerEditComponent } from './ad-campaign-traker-edit.component';

describe('AdCampaignTrakerEditComponent', () => {
  let component: AdCampaignTrakerEditComponent;
  let fixture: ComponentFixture<AdCampaignTrakerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCampaignTrakerEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCampaignTrakerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
