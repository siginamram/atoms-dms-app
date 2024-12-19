import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-quote-generation-add',
  templateUrl: './quote-generation-add.component.html',
  styleUrls: ['./quote-generation-add.component.css']
})
export class QuoteGenerationAddComponent implements OnInit {
  leadForm!: FormGroup;
  leads: any[] = [];
  filteredLeads: any[] = [];
  brandingTypes = ['Organizational', 'Personal'];
  platforms = ['FB', 'Instagram', 'YouTube', 'LinkedIn', 'Others'];

  strategiesByLevel: any = {
    No: [],
    Basic: ['Google My Business Management', 'Competitor Analysis'],
    Pro: [
      'Google My Business Management', 'Search Engine Optimization',
      'Competitor Analysis', 'Recommendation of content strategy',
      'Frequent content skeleton changes', 'Training on educational videos and templates'
    ],
    Advanced: [
      'Google My Business Management', 'Search Engine Optimization',
      'Competitor Analysis', 'Recommendation of content strategy',
      'Frequent content skeleton changes', 'Training on educational videos and templates',
      'Ad Shoots', 'Concept Shoots', 'Online Q&A interactions',
      'Behind the Scenes', 'Responding to Current Events'
    ]
  };

  advancedAssistanceOptions = [
    'SEM Assistance', 'Email Marketing Assistance', 'Influencer Marketing Assistance',
    'Just Dial Assistance', 'WhatsApp Marketing Assistance',
    'Assistance for Interview in Major YT and TV Channels'
  ];

  shootOfferOptions = ['Yes', 'No'];
  shootBudgetOptions = ['Yes', 'No'];

  constructor(private fb: FormBuilder, private marketingService: MarketingService) {}

  ngOnInit(): void {
    this.initForm();
    this.getLeads();
  }

  initForm(): void {
    this.leadForm = this.fb.group({
      leadName: ['', Validators.required],
      dateOfGeneration: ['', Validators.required],
      brandingType: ['Organizational', Validators.required],
      basePackage: [0, Validators.min(0)],

      services: this.fb.group({
        socialMediaOptimization: [true],
        dedicatedRM: [true],
        dedicatedDMA: [true],
        performanceTracker: [true],
        photoVideoShoots: [true]
      }),

      socialMediaOptimization: this.fb.group({
        creation: [true],
        contentDevelopment: [true],
        graphicDesign: [true],
        platforms: this.fb.array(this.platforms.map(() => true)) ,// All platforms checked
        otherPlatform: [''] // For input when "Others" is selected
      }),

      monthlyDeliverables: this.fb.group({
        posters: [0, Validators.min(0)],
        graphicReels: [0, Validators.min(0)],
        educationalReels: [0, Validators.min(0)],
        youtubeVideos: [0, Validators.min(0)],
        twitterVideos: [0, Validators.min(0)],
        campaignBudget: [0, Validators.min(0)]
      }),

      marketingStrategies: this.fb.group({
        level: ['Advanced', Validators.required],
        strategies: this.fb.array(this.strategiesByLevel['Advanced'].map(() => true))
      }),

      advancedAssistance: this.fb.array(this.advancedAssistanceOptions.map(() => true)),

      shootOverview: this.fb.group({
        shootOffer: ['No', Validators.required],
        shootBudget: ['No'],
        chargePerVisit: [0, Validators.min(0)]
      })
    });
  }

  getLeads(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status =1;
    this.marketingService.getLeadsByStatusAndRole(userId, status).subscribe({
      next: (data: any[]) => {
        this.leads = data || [];
        this.filteredLeads = this.leads;
      },
      error: (err) => console.error('Error fetching leads:', err)
    });
  }

  filterSearch(): void {
    const searchTerm = this.leadForm.get('leadName')?.value || '';
    this.filteredLeads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  onPlatformChange(platform: string, event: any): void {
    const platformsArray = this.leadForm.get('socialMediaOptimization.platforms') as FormArray;
  
    if (!platformsArray) {
      console.error('Platforms array is not initialized');
      return;
    }
  
    if (event.checked) {
      // Add the platform if not already included
      if (!platformsArray.value.includes(platform)) {
        platformsArray.push(this.fb.control(platform));
      }
  
      // Handle "Others" input initialization
      if (platform === 'Others') {
        this.leadForm.get('socialMediaOptimization.otherPlatform')?.setValue('');
      }
    } else {
      // Remove the platform if it exists
      const index = platformsArray.controls.findIndex((control) => control.value === platform);
      if (index !== -1) {
        platformsArray.removeAt(index);
      }
  
      // Clear "Others" input when unchecked
      if (platform === 'Others') {
        this.leadForm.get('socialMediaOptimization.otherPlatform')?.reset();
      }
    }
  }
  
  
  
  onLevelChange(): void {
    const level = this.leadForm.get('marketingStrategies.level')?.value;
    const strategiesArray = this.leadForm.get('marketingStrategies.strategies') as FormArray;
    strategiesArray.clear();
    this.strategiesByLevel[level].forEach(() => strategiesArray.push(this.fb.control(true)));
  }

  onSubmit(): void {
    if (this.leadForm.valid) {
      console.log('Submitted Form:', this.leadForm.value);
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
