import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCampaignManagementComponent } from './ad-campaign-management.component';

describe('AdCampaignManagementComponent', () => {
  let component: AdCampaignManagementComponent;
  let fixture: ComponentFixture<AdCampaignManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCampaignManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCampaignManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
