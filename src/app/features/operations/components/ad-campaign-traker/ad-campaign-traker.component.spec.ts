import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCampaignTrakerComponent } from './ad-campaign-traker.component';

describe('AdCampaignTrakerComponent', () => {
  let component: AdCampaignTrakerComponent;
  let fixture: ComponentFixture<AdCampaignTrakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCampaignTrakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCampaignTrakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
