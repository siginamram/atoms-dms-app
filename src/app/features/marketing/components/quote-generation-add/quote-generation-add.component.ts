import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'; // To fetch route parameters
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 

@Component({
  selector: 'app-quote-generation-add',
  standalone:false,
  templateUrl: './quote-generation-add.component.html',
  styleUrls: ['./quote-generation-add.component.css'],
})
export class QuoteGenerationAddComponent implements OnInit {
  leadForm!: FormGroup;
  minDate: Date;
  leads: any[] = [];
  filteredLeads: any[] = [];
  brandingTypes = ['Organizational', 'Personal'];
  platforms = ['FB', 'Instagram', 'YouTube', 'LinkedIn', 'Others'];
  strategiesByLevel: any = {
    Stater: [],
    Basic: ['Google My Business Management', 'Competitor Analysis'],
    Pro: [
      'Google My Business Management',
      'Search Engine Optimization',
      'Competitor Analysis',
      'Recommendation of content strategy',
      'Frequent content skeleton changes',
      'Training on educational videos and templates',
    ],
    Advanced: [
      'Google My Business Management',
      'Search Engine Optimization',
      'Competitor Analysis',
      'Recommendation of content strategy',
      'Frequent content skeleton changes',
      'Training on educational videos and templates',
      'Ad Shoots',
      'Concept Shoots',
      'Online Q&A interactions',
      'Behind the Scenes',
      'Responding to Current Events',
    ],
    Gold: [
      'Google My Business Management',
      'Search Engine Optimization',
      'Competitor Analysis',
      'Recommendation of content strategy',
      'Frequent content skeleton changes',
      'Training on educational videos and templates',
      'Ad Shoots',
      'Concept Shoots',
      'Online Q&A interactions',
      'Behind the Scenes',
      'Responding to Current Events',
    ],
  };
  advancedAssistanceOptions = [
    'SEM Assistance',
    'Email Marketing Assistance',
    'Influencer Marketing Assistance',
    'Just Dial Assistance',
    'WhatsApp Marketing Assistance',
    'Assistance for Interview in Major YT and TV Channels',
  ];
  shootOfferOptions = ['Yes', 'No'];
  shootBudgetOptions = ['Yes', 'No'];
  leadID: number | null = null;
  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private route: ActivatedRoute ,// To read route parameters
    private Router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) { 
     this.minDate = new Date(); // Set minDate to today's date
    }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params) => {
      this.leadID = +params['id'];
      if (this.leadID) {
        this.getLeads();
        this.fetchLeadData(this.leadID); // Load client details for the given LeadID
     
      }
    });
  }

  initForm(): void {
    this.leadForm = this.fb.group({
      leadName: [{ value: '', disabled: true }],
      dateOfGeneration: ['', Validators.required],
      brandingType: ['Organizational', Validators.required],
      basePackage: [0, Validators.min(0)],
      services: this.fb.group({
        socialMediaOptimization: [true],
        dedicatedRM: [true],
        dedicatedDMA: [true],
        performanceTracker: [true],
        photoVideoShoots: [true],
      }),
      socialMediaOptimization: this.fb.group({
        creation: [true],
        contentDevelopment: [true],
        graphicDesign: [true],
        facebook: [false],
        instagram: [false],
        linkedin: [false],
        youtube: [false],
        others: [false],
        otherPlatform: [''],
      }),
      monthlyDeliverables: this.fb.group({
        posters: [0, Validators.min(0)],
        graphicReels: [0, Validators.min(0)],
        educationalReels: [0, Validators.min(0)],
        youtubeVideos: [0, Validators.min(0)],
        //twitterVideos: [0, Validators.min(0)],
        campaignBudget: [0, Validators.required],
      }),
      marketingStrategies: this.fb.group({
        level: ['Advanced', Validators.required],
        strategies: this.fb.array(
          this.strategiesByLevel['Advanced'].map(() => true)
        ),
      }),
      advancedAssistance: this.fb.array(
        this.advancedAssistanceOptions.map(() => true)
      ),
      shootOverview: this.fb.group({
        shootOffer: ['No', Validators.required],
        shootBudget: ['No'],
        chargePerVisit: [0, Validators.min(0)],
      }),
    });
  }

  getLeads(): void {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status = 1;
  
    this.marketingService.getLeadsByStatusAndRole(userId, status).subscribe({
      next: (data: any[]) => {
        this.leads = data || [];
  
        // Find the lead by this.leadID
        const selectedLead = this.leads.find((lead) => lead.leadID === this.leadID);
        const organizationName = selectedLead?.organizationName || '';
        // Bind the lead name to the form
        this.leadForm.patchValue({
          leadName: organizationName,
        });
      },
      error: (err) => console.error('Error fetching leads:', err),
    });
  }
  

  mapMarketingStrategyLevel(selectedLevel: number): string {
    switch (selectedLevel) {
      case 1:
        return 'Stater';
      case 2:
        return 'Basic';
      case 3:
        return 'Pro';
      case 4:
        return 'Advanced';
      case 5:
        return 'Gold';
      default:
        return 'No';
    }
  }
  mapMarketingStrategyLevelToValue(level: string): number {
    switch (level) {
      case 'Stater':
        return 1;
      case 'Basic':
        return 2;
      case 'Pro':
        return 3;
      case 'Advanced':
        return 4;
        case 'Gold':
          return 5;
      default:
        return 1; // Default to "No"
    }
  }

  fetchLeadData(leadId: number): void {
    this.getLeads();
    this.marketingService.getQuoteByLeadId(leadId).subscribe({
      next: (data: any) => {
        if (data.leadID === 0) {
          console.warn('No valid data found for the given lead ID:', leadId);
          return; // Skip binding values to the form
        }

        // Map the API response to form fields
        this.leadForm.patchValue({
          leadName: data.organizationName || '', // Ensure a default value
          dateOfGeneration: data.date, // Default value if missing
          brandingType: data.branding === 1 ? 'Organizational' : 'Personal', // Map branding type

          basePackage: data.leadPackage?.basePackage || 0,

          services: {
            socialMediaOptimization: data.clientServices?.smOptimization || false,
            dedicatedRM: data.clientServices?.dedicatedRM || false,
            dedicatedDMA: data.clientServices?.dedicatedDMA || false,
            performanceTracker: data.clientServices?.monthlyPerformanceTracker || false,
            photoVideoShoots: data.clientServices?.monthlyShoot || false,
          },

          socialMediaOptimization: {
            creation: data.socialMediaOptimization?.creationOfSM || false,
            contentDevelopment: data.socialMediaOptimization?.contentDevelopment || false,
            graphicDesign: data.socialMediaOptimization?.graphicDesign || false,
            facebook: data.socialMediaOptimization?.smFaceBook || false,
            instagram: data.socialMediaOptimization?.smInstagram || false,
            linkedin: data.socialMediaOptimization?.smLinkedin || false,
            youtube: data.socialMediaOptimization?.smYoutube || false,
            others: data.socialMediaOptimization?.smOthers || false,
            otherPlatform: data.socialMediaOptimization?.smOthersText || '',
          },

          monthlyDeliverables: {
            posters: data.leadPackage?.noOfPosters || 0,
            graphicReels: data.leadPackage?.noOfGraphicReels || 0,
            educationalReels: data.leadPackage?.noOfEducationalReels || 0,
            youtubeVideos: data.leadPackage?.noOfYouTubeVideos || 0,
            //twitterVideos: 0, // Default value if not provided in the payload
            campaignBudget: data.leadPackage?.adBudget || 0,
          },

          marketingStrategies: {
            level: this.mapMarketingStrategyLevel(data.marketingStrategies?.selectedMarketingStrategy || 0),
            strategies: [
              data.marketingStrategies?.googleMyBusiness || false,
              data.marketingStrategies?.competitorAnalysis || false,
              data.marketingStrategies?.podcast || false,
              data.marketingStrategies?.recommendingContentStratagy || false,
              data.marketingStrategies?.respondingToEvents || false,
              data.marketingStrategies?.trainingOnEdVideos || false,
              data.marketingStrategies?.skeletonChangeBasedOnPerson || false,
              data.marketingStrategies?.adShoots || false,
              data.marketingStrategies?.conceptShhots || false,
              data.marketingStrategies?.onlineQAInteracts || false,
              data.marketingStrategies?.seo || false,
              data.marketingStrategies?.behindScenes || false,
            ],
          },

          advancedAssistance: [
            data.advanceAssistance?.sem || false,
            data.advanceAssistance?.emailMarketing || false,
            data.advanceAssistance?.justDail || false,
            data.advanceAssistance?.influencerMarketing || false,
            data.advanceAssistance?.whatsappMarketing || false,
            data.advanceAssistance?.interviewInYTAndTV || false,
          ],

          shootOverview: {
            shootOffer: data.leadPackage?.shootOffered ? 'Yes' : 'No',
            shootBudget: data.leadPackage?.shootBudgetOffered ? 'Yes' : 'No',
            chargePerVisit: data.leadPackage?.chargesPerVisit || 0,
          },
        });
      },
      error: (err) => {
        console.error('Error fetching lead data:', err);
        alert('Failed to fetch lead data. Please try again.');
      },
    });
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

  generateQuote(): void {
    this.Router.navigate([`/home/marketing/generated-quote-download/${this.leadID}`]);
  }

  onSubmit(): void {
    if (this.leadForm.valid) {
      const userID = parseInt(localStorage.getItem('UserID') || '0', 10); // Get user ID from localStorage
      const payload = {
        leadID: this.leadID, // Use leadID from the route
        salesPersonID: userID, // Use salesPersonID from localStorage
        date: this.leadForm.get('dateOfGeneration')?.value,
        branding: this.leadForm.get('brandingType')?.value === 'Organizational' ? 1 : 2, // Map branding type to API values
        leadPackage: {
          leadID: this.leadID,
          noOfPosters: this.leadForm.get('monthlyDeliverables.posters')?.value,
          noOfGraphicReels: this.leadForm.get('monthlyDeliverables.graphicReels')?.value,
          noOfEducationalReels: this.leadForm.get('monthlyDeliverables.educationalReels')?.value,
          noOfYouTubeVideos: this.leadForm.get('monthlyDeliverables.youtubeVideos')?.value,
          basePackage: this.leadForm.get('basePackage')?.value,
          shootOffered: this.leadForm.get('shootOverview.shootOffer')?.value === 'Yes',
          shootBudgetOffered: this.leadForm.get('shootOverview.shootBudget')?.value === 'Yes',
          chargesPerVisit: this.leadForm.get('shootOverview.chargePerVisit')?.value,
          adBudget: this.leadForm.get('monthlyDeliverables.campaignBudget')?.value,
          noSCForAdCMUpto: 0, // Default value if not in form
          requiredToDedicateAdditionalAdBudget: true, // Default value or from form
        },
        marketingStrategies: {
          leadID: this.leadID,
          selectedMarketingStrategy: this.mapMarketingStrategyLevelToValue(
            this.leadForm.get('marketingStrategies.level')?.value
          ),
          googleMyBusiness: this.leadForm.get('marketingStrategies.strategies')?.value[0],
          competitorAnalysis: this.leadForm.get('marketingStrategies.strategies')?.value[1],
          podcast: this.leadForm.get('marketingStrategies.strategies')?.value[2],
          recommendingContentStratagy: this.leadForm.get('marketingStrategies.strategies')?.value[3],
          respondingToEvents: this.leadForm.get('marketingStrategies.strategies')?.value[4],
          trainingOnEdVideos: this.leadForm.get('marketingStrategies.strategies')?.value[5],
          skeletonChangeBasedOnPerson: this.leadForm.get('marketingStrategies.strategies')?.value[6],
          adShoots: this.leadForm.get('marketingStrategies.strategies')?.value[7],
          conceptShhots: this.leadForm.get('marketingStrategies.strategies')?.value[8],
          onlineQAInteracts: this.leadForm.get('marketingStrategies.strategies')?.value[9],
          seo: this.leadForm.get('marketingStrategies.strategies')?.value[10],
          behindScenes: this.leadForm.get('marketingStrategies.strategies')?.value[11],
        },
        advanceAssistance: {
          leadID: this.leadID,
          sem: this.leadForm.get('advancedAssistance')?.value[0],
          emailMarketing: this.leadForm.get('advancedAssistance')?.value[1],
          justDail: this.leadForm.get('advancedAssistance')?.value[2],
          influencerMarketing: this.leadForm.get('advancedAssistance')?.value[3],
          whatsappMarketing: this.leadForm.get('advancedAssistance')?.value[4],
          interviewInYTAndTV: this.leadForm.get('advancedAssistance')?.value[5],
        },
        clientServices: {
          leadID: this.leadID,
          smOptimization: this.leadForm.get('services.socialMediaOptimization')?.value,
          dedicatedRM: this.leadForm.get('services.dedicatedRM')?.value,
          dedicatedDMA: this.leadForm.get('services.dedicatedDMA')?.value,
          monthlyPerformanceTracker: this.leadForm.get('services.performanceTracker')?.value,
          monthlyShoot: this.leadForm.get('services.photoVideoShoots')?.value,
        },
        socialMediaOptimization: {
          leadID: this.leadID,
          creationOfSM: this.leadForm.get('socialMediaOptimization.creation')?.value,
          contentDevelopment: this.leadForm.get('socialMediaOptimization.contentDevelopment')?.value,
          graphicDesign: this.leadForm.get('socialMediaOptimization.graphicDesign')?.value,
          smPlantforms: true, // Always set to true
          smFaceBook: this.leadForm.get('socialMediaOptimization.facebook')?.value,
          smInstagram: this.leadForm.get('socialMediaOptimization.instagram')?.value,
          smLinkedin: this.leadForm.get('socialMediaOptimization.linkedin')?.value,
          smYoutube: this.leadForm.get('socialMediaOptimization.youtube')?.value,
          smOthers: this.leadForm.get('socialMediaOptimization.others')?.value,
          smOthersText: this.leadForm.get('socialMediaOptimization.otherPlatform')?.value || '',
        },
      };

      // Submit the payload to the API
      this.marketingService.saveQuote(payload).subscribe({
        next: (response) => {
          this.openAlertDialog('Success', 'Quote saved successfully!');
          this.Router.navigate(['/home/marketing/generate-quote']);
        },
        error: (err) => {
          console.error('Error saving quote:', err);
          this.openAlertDialog('Error', 'Failed to save quote. Please try again.');
        },
      });
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }
  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type: title.toLowerCase(), // success, error, or warning
      },
    });
  }
}
