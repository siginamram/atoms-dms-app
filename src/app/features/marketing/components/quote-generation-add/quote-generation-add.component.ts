import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'; // To fetch route parameters
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  allStrategies: any = ['Google My Business Management',
      'Search Engine Optimization',
      'Competitor Analysis',
      'Recommendation of content strategy',
      'Frequent content skeleton changes',
      'Training on educational videos and templates',
      'Ad Shoots',
      'Concept Shoots',
      'Online Q&A interactions',
      'Behind the Scenes',
      'Responding to Current Events']
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
  shootBudgetOptions = ['Yes', 'No'];
  leadID: number | null = null;
  quotationData: any;
  deliverables = ['Posters', 'Graphic Reels', 'Educational Reels', 'Youtube Videos',  'Campaign Budget'];
  deliverableFields: any = {
    'Posters': 'posters',
    'Graphic Reels': 'graphicReels',
    'Educational Reels':'educationalReels',
    'Youtube Videos': 'youtubeVideos',
    'Campaign Budget':'campaignBudget'
  }
  showSpinner = false;
  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private route: ActivatedRoute ,// To read route parameters
    private Router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) { 
     this.minDate = new Date(); // Set minDate to today's date
    }
    @ViewChild('modalButton') myButton!: ElementRef<HTMLButtonElement>;

  async ngOnInit() {
    this.initForm();
    this.route.params.subscribe(async (params) => {
      this.showSpinner = true
      this.leadID = +params['id'];
      if (this.leadID) {
      await this.getLeads();
      this.fetchLeadData(this.leadID); // Load client details for the given LeadID
      this.showSpinner = false;
      }
    });
  }

  initForm(): void {
    this.leadForm = this.fb.group({
      leadName: [{ value: '', disabled: true }],
      dateOfGeneration: ['', Validators.required],
      brandingType: ['Organizational', Validators.required],
      basePackage: [0,[ Validators.min(0),  Validators.pattern('^[0-9]*\.?[0-9]+$')]],
      services: this.fb.group({
        socialMediaOptimization: [true],
        dedicatedRM: [true],
        dedicatedDMA: [true],
        addCampaignManagement: [true],
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
        google: [false],
        others: [false],
        otherPlatform: [''],
      }),
      monthlyDeliverables: this.fb.group({
        posters: [0, [ Validators.min(0),  Validators.pattern('^[0-9]*\.?[0-9]+$')]],
        graphicReels: [0, [ Validators.min(0),  Validators.pattern('^[0-9]*\.?[0-9]+$')]],
        educationalReels: [0, [ Validators.min(0),  Validators.pattern('^[0-9]*\.?[0-9]+$')]],
        youtubeVideos: [0,  [ Validators.min(0),  Validators.pattern('^[0-9]*\.?[0-9]+$')]],
        //twitterVideos: [0, Validators.min(0)],
        campaignBudget: [0, [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')]],
      }),
      marketingStrategies: this.fb.group({
        level: ['Advanced', Validators.required],
        googleMyBusiness:[true],
        seo: [true],
        podcast:[true],
        competitorAnalysis: [true],
        recommendingContentStratagy: [true],
        skeletonChangeBasedOnPerson: [true],
        trainingOnEdVideos: [true],
        adShoots: [true],
        conceptShhots: [true],
        onlineQAInteracts: [true],
        behindScenes: [true],
        respondingToEvents: [true]
      }),
      advancedAssistance: this.fb.array(
        this.advancedAssistanceOptions.map(() => true)
      ),
      shootOverview: this.fb.group({
        shootBudget: ['No', Validators.required],
        chargePerVisit: [0, Validators.pattern('^[0-9]*\.?[0-9]+$')],
      }),
      requiredToDedicateAdditionalAdBudget: [true],
      noSCForAdCMUpto: [0, Validators.pattern('^[0-9]*\.?[0-9]+$')] 
    });
  }

 async getLeads() {
    const userId = parseInt(localStorage.getItem('UserID') || '0', 10);
    const status = 1;
  
   await this.marketingService.getLeadsByStatusAndRole(userId, status).subscribe({
      next: (data: any[]) => {
        this.leads = data || [];
  
        // Find the lead by this.leadID
        // const selectedLead = this.leads.find((lead) => lead.leadID === this.leadID);
        // const organizationName = selectedLead?.organizationName || '';
        // // Bind the lead name to the form
        // this.leadForm.patchValue({
        //   leadName: organizationName,
        // });
      },
      error: (err) => console.error('Error fetching leads:', err),
    });
  }
  
  onCheckboxChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.deliverables = ['Posters', 'Graphic Reels', 'Educational Reels', 'Youtube Videos',  'Campaign Budget'];
    } else {
      this.deliverables = ['Posters', 'GraphicReels', 'Educational Reels',  'Campaign Budget'];
    }
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

    this.marketingService.getQuoteByLeadId(leadId).subscribe({
      next: (data: any) => {
        if(!data.socialMediaOptimization?.smYoutube){
          this.deliverables = ['Posters', 'Graphic Reels', 'Educational Reels',  'Campaign Budget'];
        }
        this.quotationData = data
        // if (data.leadID === 0) {
        //   console.warn('No valid data found for the given lead ID:', leadId);
        //   return; // Skip binding values to the form
        // }

        //Find the lead by this.leadID
        const selectedLead = this.leads.find((lead) => lead.leadID === this.leadID);
        const organizationName = selectedLead?.organizationName || '';
        console.log(organizationName)
        // Map the API response to form fields
        this.leadForm.patchValue({
          leadName: organizationName || '', // Ensure a default value
          dateOfGeneration:  data.date && data.date  !== '0001-01-01T00:00:00' ? new Date(data.date) : new Date() ,// Default value if missing
          brandingType: data.branding === 1 ? 'Organizational' : 'Personal', // Map branding type

          basePackage: data.leadPackage?.basePackage || 0,

          services: {
            socialMediaOptimization: data.clientServices?.smOptimization || false,
            dedicatedRM: data.clientServices?.dedicatedRM || false,
            dedicatedDMA: data.clientServices?.dedicatedDMA || false,
            addCampaignManagement: data.clientServices?.addCampaignManagement || false,
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
            google: data.socialMediaOptimization?.smGoogle || false,
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
            googleMyBusiness: data.marketingStrategies?.googleMyBusiness || false,
            seo:  data.marketingStrategies?.seo || false,
            podcast: data.marketingStrategies?.podcast || false,
            competitorAnalysis: data.marketingStrategies?.competitorAnalysis || false,
            recommendingContentStratagy: data.marketingStrategies?.recommendingContentStratagy || false,
            skeletonChangeBasedOnPerson: data.marketingStrategies?.skeletonChangeBasedOnPerson || false,
            trainingOnEdVideos: data.marketingStrategies?.trainingOnEdVideos || false,
            adShoots: data.marketingStrategies?.adShoots || false,
            conceptShhots: data.marketingStrategies?.conceptShhots || false,
            onlineQAInteracts: data.marketingStrategies?.onlineQAInteracts || false,
            behindScenes:  data.marketingStrategies?.behindScenes || false,
            respondingToEvents: data.marketingStrategies?.respondingToEvents || false
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
            shootBudget: data.leadPackage?.shootBudgetOffered ? 'Yes' : 'No',
            chargePerVisit: data.leadPackage?.chargesPerVisit || 0,
          },
          noSCForAdCMUpto: data.leadPackage?.noSCForAdCMUpto || 0,
          requiredToDedicateAdditionalAdBudget: data.leadPackage?.requiredToDedicateAdditionalAdBudget || false
          
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
    const level = this.mapMarketingStrategyLevelToValue(this.leadForm.get('marketingStrategies.level')?.value);
    if(level == 1){
      this.leadForm.patchValue({
        marketingStrategies: {
          googleMyBusiness: false,
          seo: false,
          podcast: false,
          competitorAnalysis: false,
          recommendingContentStratagy: false,
          skeletonChangeBasedOnPerson: false,
          trainingOnEdVideos: false,
          adShoots:  false,
          conceptShhots: false,
          onlineQAInteracts: false,
          behindScenes: false,
          respondingToEvents: false
        }
      })
    }
    else if(level == 2){
      this.leadForm.patchValue({
        marketingStrategies: {
          googleMyBusiness: true,
          seo: true,
          podcast: false,
          competitorAnalysis: false,
          recommendingContentStratagy: false,
          skeletonChangeBasedOnPerson: false,
          trainingOnEdVideos: false,
          adShoots:  false,
          conceptShhots: false,
          onlineQAInteracts: false,
          behindScenes: false,
          respondingToEvents: false
        }
      })
    }
    else if(level == 3){
      this.leadForm.patchValue({
        marketingStrategies: {
          googleMyBusiness: true,
          seo: true,
          podcast: true,
          competitorAnalysis: true,
          recommendingContentStratagy: true,
          skeletonChangeBasedOnPerson: true,
          trainingOnEdVideos: true,
          adShoots:  false,
          conceptShhots: false,
          onlineQAInteracts: false,
          behindScenes: false,
          respondingToEvents: false
        }
      })
    }
    else if(level == 4 || level == 5){
      this.leadForm.patchValue({
        marketingStrategies: {
          googleMyBusiness: true,
          seo: true,
          podcast: true,
          competitorAnalysis: true,
          recommendingContentStratagy: true,
          skeletonChangeBasedOnPerson: true,
          trainingOnEdVideos: true,
          adShoots:  true,
          conceptShhots: true,
          onlineQAInteracts: true,
          behindScenes: true,
          respondingToEvents: true
        }
      })
    }
  }

  generateQuote(): void {
   
    const payload = {
      leadID: this.leadID, // Use leadID from the route
      date: this.leadForm.get('dateOfGeneration')?.value,
      leadPackage: {
        leadID: this.leadID,
        noOfPosters: this.leadForm.get('monthlyDeliverables.posters')?.value,
        noOfGraphicReels: this.leadForm.get('monthlyDeliverables.graphicReels')?.value,
        noOfEducationalReels: this.leadForm.get('monthlyDeliverables.educationalReels')?.value,
        noOfYouTubeVideos: this.leadForm.get('monthlyDeliverables.youtubeVideos')?.value,
        basePackage: this.leadForm.get('basePackage')?.value,
        shootBudgetOffered: this.leadForm.get('shootOverview.shootBudget')?.value === 'Yes',
        chargesPerVisit: this.leadForm.get('shootOverview.chargePerVisit')?.value,
        adBudget: this.leadForm.get('monthlyDeliverables.campaignBudget')?.value,
        noSCForAdCMUpto: this.leadForm.get('noSCForAdCMUpto')?.value, // Default value if not in form
        requiredToDedicateAdditionalAdBudget: this.leadForm.get('requiredToDedicateAdditionalAdBudget')?.value, // Default value or from form
      },
      marketingStrategies: {
        leadID: this.leadID,
        selectedMarketingStrategy: this.mapMarketingStrategyLevelToValue(
          this.leadForm.get('marketingStrategies.level')?.value
        ),
        googleMyBusiness: this.leadForm.get('marketingStrategies.googleMyBusiness')?.value,
        competitorAnalysis: this.leadForm.get('marketingStrategies.competitorAnalysis')?.value,
        podcast: this.leadForm.get('marketingStrategies.podcast')?.value,
        recommendingContentStratagy: this.leadForm.get('marketingStrategies.recommendingContentStratagy')?.value,
        respondingToEvents: this.leadForm.get('marketingStrategies.respondingToEvents')?.value,
        trainingOnEdVideos: this.leadForm.get('marketingStrategies.trainingOnEdVideos')?.value,
        skeletonChangeBasedOnPerson: this.leadForm.get('marketingStrategies.skeletonChangeBasedOnPerson')?.value,
        adShoots: this.leadForm.get('marketingStrategies.adShoots')?.value,
        conceptShhots: this.leadForm.get('marketingStrategies.conceptShhots')?.value,
        onlineQAInteracts: this.leadForm.get('marketingStrategies.onlineQAInteracts')?.value,
        seo: this.leadForm.get('marketingStrategies.seo')?.value,
        behindScenes: this.leadForm.get('marketingStrategies.behindScenes')?.value,
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
        addCampaignManagement: this.leadForm.get('services.addCampaignManagement')?.value,
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
        smGoogle: this.leadForm.get('socialMediaOptimization.google')?.value,
        smOthers: this.leadForm.get('socialMediaOptimization.others')?.value,
        smOthersText: this.leadForm.get('socialMediaOptimization.otherPlatform')?.value || '',
      },
    };
    const encodedObject = btoa(JSON.stringify(payload))
    this.Router.navigate([`/home/marketing/generated-quote-download`],{ queryParams: { data: encodedObject } });
  }

  onSubmit(): void {
    this.showSpinner = true
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
          shootBudgetOffered: this.leadForm.get('shootOverview.shootBudget')?.value === 'Yes',
          chargesPerVisit: this.leadForm.get('shootOverview.chargePerVisit')?.value,
          adBudget: this.leadForm.get('monthlyDeliverables.campaignBudget')?.value,
          noSCForAdCMUpto: this.leadForm.get('noSCForAdCMUpto')?.value, // Default value if not in form
          requiredToDedicateAdditionalAdBudget: this.leadForm.get('requiredToDedicateAdditionalAdBudget')?.value, // Default value or from form
        },
        marketingStrategies: {
          leadID: this.leadID,
          selectedMarketingStrategy: this.mapMarketingStrategyLevelToValue(
            this.leadForm.get('marketingStrategies.level')?.value
          ),
          googleMyBusiness: this.leadForm.get('marketingStrategies.googleMyBusiness')?.value,
          competitorAnalysis: this.leadForm.get('marketingStrategies.competitorAnalysis')?.value,
          podcast: this.leadForm.get('marketingStrategies.podcast')?.value,
          recommendingContentStratagy: this.leadForm.get('marketingStrategies.recommendingContentStratagy')?.value,
          respondingToEvents: this.leadForm.get('marketingStrategies.respondingToEvents')?.value,
          trainingOnEdVideos: this.leadForm.get('marketingStrategies.trainingOnEdVideos')?.value,
          skeletonChangeBasedOnPerson: this.leadForm.get('marketingStrategies.skeletonChangeBasedOnPerson')?.value,
          adShoots: this.leadForm.get('marketingStrategies.adShoots')?.value,
          conceptShhots: this.leadForm.get('marketingStrategies.conceptShhots')?.value,
          onlineQAInteracts: this.leadForm.get('marketingStrategies.onlineQAInteracts')?.value,
          seo: this.leadForm.get('marketingStrategies.seo')?.value,
          behindScenes: this.leadForm.get('marketingStrategies.behindScenes')?.value,
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
          addCampaignManagement: this.leadForm.get('services.addCampaignManagement')?.value,
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
          smGoogle: this.leadForm.get('socialMediaOptimization.google')?.value,
          smOthers: this.leadForm.get('socialMediaOptimization.others')?.value,
          smOthersText: this.leadForm.get('socialMediaOptimization.otherPlatform')?.value || '',
        },
      };

      // Submit the payload to the API
      this.marketingService.saveQuote(payload).subscribe(
         (response) => {
          if(response == 'Success'){
            this.showSpinner = false
            this.myButton.nativeElement.click();
            
          }
          else{
            this.showSpinner = false
            this.openAlertDialog('Error', response || 'Unexpected server response.');

          }

          //this.openAlertDialog('Success', 'Quote saved successfully!');
          // this.Router.navigate(['/home/marketing/generate-quote']);
        },
         (error) => {
          this.showSpinner = false
          console.error('Error saving quote:', error);
          this.openAlertDialog('Error', 'Failed to save quote. Please try again.');
        },
      );
    } else {
      this.showSpinner = false
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

  redirect(){
    this.Router.navigate(['/home/marketing/generate-quote']);
  }
}
