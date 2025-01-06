import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sla-generation-add',
  standalone:false,
  templateUrl: './sla-generation-add.component.html',
  styleUrls: ['./sla-generation-add.component.css'],
})
export class SlaGenerationAddComponent implements OnInit {
  slaForm: FormGroup;
  leadID: number | null = null; // Store the current LeadID
  minDate: Date;
  salesPersonDesignation: any;
  salesPersonName: any;
  showSpinner: boolean = false;
  @ViewChild('modalButton') myButton!: ElementRef<HTMLButtonElement>;
  constructor(
    private fb: FormBuilder,
    private commanApiService: MarketingService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog // Correctly initialized MatDialog
  ) {
    this.minDate = new Date(); // Set minDate to today's date
    // Initialize the form with required validators
    this.slaForm = this.fb.group({
      leadName: ['', Validators.required],
      organizationDomain: ['', Validators.required],
      clientName: ['', Validators.required],
      designation: ['', Validators.required],
      paymentDuedate:['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      posterDesigns: ['', Validators.required],
      youtubeVideos: ['', Validators.required],
      graphicReel: ['', Validators.required],
      educationalReel: ['', Validators.required],
      addBudget: ['', Validators.required],
      shootOffer: ['', Validators.required],
      shootBudget: [null],
      chargePerVisit: [''],
      basePackage: ['', Validators.required],
      facebook: [false],
      instagram: [false],
      linkedin: [false],
      youtube: [false],
      google: [false],
      others: [false],
      otherPlatforms: [''], // Store the value of the "Other Platforms" field
    });

    // Dynamically validate "Other Platforms" field based on "others" checkbox
    this.slaForm.get('others')?.valueChanges.subscribe((othersSelected) => {
      if (othersSelected) {
        this.slaForm.get('otherPlatforms')?.setValidators(Validators.required);
      } else {
        this.slaForm.get('otherPlatforms')?.clearValidators();
      }
      this.slaForm.get('otherPlatforms')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Fetch LeadID from route parameters
    this.route.params.subscribe((params) => {
      this.leadID = +params['id'];
      if (this.leadID) {
        this.loadClientDetails(this.leadID); // Load client details for the given LeadID
      }
    });
  }

  // Load client details using the API
  loadClientDetails(leadID: number): void {
    this.showSpinner = true;
    this.commanApiService.getClientByLeadId(leadID).subscribe(
      (data: any) => {
        console.log('Client Details:', data);
        this.salesPersonName = data?.salesPersonName;
        this.salesPersonDesignation = data?.salesPersonDesignation;
        // Bind API data to the form
        this.slaForm.patchValue({
          leadName: data.organizationName || '',
          organizationDomain: data.domain || '',
          clientName: data.clientName || '',
          designation: data.clientDesignation || '',
          paymentDuedate:data.paymentDate || '',
          city: data.cityName || '',
          address: data.address || '',
          posterDesigns: data.package?.noOfPosters || 0,
          youtubeVideos: data.package?.noOfYouTubeVideos || 0,
          graphicReel: data.package?.noOfGraphicReels || 0,
          educationalReel: data.package?.noOfEducationalReels || 0,
          addBudget: data.package?.adBudget || 0,
          shootOffer:  data.package?.shootOffered === true || data.package?.shootOffered === 1 ? 1 : 0,
          shootBudget:  data.package?.shootBudget === true || data.package?.shootBudget === 1 ? 1 : 0,
          chargePerVisit: data.package?.chargePerVisit || 0,
          basePackage: data.package?.basePackage || 0,
          facebook: data.package?.smFaceBook || false,
          instagram: data.package?.smInstagram || false,
          linkedin: data.package?.smLinkedin || false,
          youtube: data.package?.smYoutube || false,
          google: data.package?.smGoogle || false,
          others: data.package?.smOthers || false,
          otherPlatforms: data.package?.smOthersText || '',
        });
        this.showSpinner = false;
      },
      (error) => {
        this.showSpinner = false;
        console.error('Failed to fetch client details:', error);
      }
    );
  }
  generateSLA(): void {
    const formData = this.slaForm.value;
    const payload = {

      clientName: formData.clientName,
      clientDesignation: formData.designation,
      paymentDate: formData.paymentDuedate,
      organizationName: formData.leadName,
      address: formData.address,
      createdBy: parseInt(localStorage.getItem('UserID') || '0', 10),
      package: {
        basePackage: parseFloat(formData.basePackage),
        adBudget: parseFloat(formData.addBudget),
        noOfPosters: parseInt(formData.posterDesigns, 10),
        noOfGraphicReels: parseInt(formData.graphicReel, 10),
        noOfEducationalReels: parseInt(formData.educationalReel, 10),
        noOfYouTubeVideos: parseInt(formData.youtubeVideos, 10),
        shootOffered: formData.shootOffer === 1 ,
        shootBudget: formData.shootBudget === 1,
        chargePerVisit: parseFloat(formData.chargePerVisit),
        smFaceBook: formData.facebook,
        smInstagram: formData.instagram,
        smLinkedin: formData.linkedin,
        smYoutube: formData.youtube,
        smGoogle : formData.google,
        smOthers: formData.others,
        smOthersText: formData.otherPlatforms || '',
      },
      advancePaymentStatus: 1,
      salesPersonDesignation: this.salesPersonDesignation,
      salesPersonName: this.salesPersonName
    };
    const encodedObject = btoa(JSON.stringify(payload))
    this.router.navigate([`/home/marketing/sla-download`],{ queryParams: { data: encodedObject } });
  }

  // Handle form submission
  onSubmit(): void {
    this.showSpinner = true;
    if (this.slaForm.valid) {
      const formData = this.slaForm.value;
  
      const payload = {
        clientName: formData.clientName,
        clientDesignation: formData.designation,
        paymentDate:this.formatDate(new Date(this.slaForm.get('paymentDuedate')?.value)),
        organizationName: formData.leadName,
        address: formData.address,
        domain: formData.organizationDomain,
        clientCategory: 1,
        leadID: this.leadID || 0,
        createdBy: parseInt(localStorage.getItem('UserID') || '0', 10),
        isActive: true,
        package: {
          basePackage: parseFloat(formData.basePackage),
          adBudget: parseFloat(formData.addBudget),
          noOfPosters: parseInt(formData.posterDesigns, 10),
          noOfGraphicReels: parseInt(formData.graphicReel, 10),
          noOfEducationalReels: parseInt(formData.educationalReel, 10),
          noOfYouTubeVideos: parseInt(formData.youtubeVideos, 10),
          shootOffered: formData.shootOffer === 1,
          shootBudget: formData.shootOffer === 1 ? formData.shootBudget === 1 :false,
          chargePerVisit: formData.shootOffer === 1 ? parseFloat(formData.chargePerVisit) || 0 : 0 ,
          smFaceBook: formData.facebook,
          smInstagram: formData.instagram,
          smLinkedin: formData.linkedin,
          smYoutube: formData.youtube,
          smGoogle : formData.google,
          smOthers: formData.others,
          smOthersText: formData.otherPlatforms || '',
        },
        advancePaymentStatus: 1,
      };
  
  
      this.commanApiService.addClient(payload).subscribe(
        (response: string) => {
          console.log('Response from API:', response);
          this.showSpinner = false;
          // Handle backend response that sends plain text like "Success"
          if (response === 'Success') {
            this.myButton.nativeElement.click();
          } else {
            this.openAlertDialog('Error', response || 'Unexpected server response.');
          }
        },
        (error: any) => {
          this.showSpinner = false;
          console.error('Error adding client:', error);
  
          // Handle potential HTTP error with fallback message
          const errorMessage =
            error?.error?.message || 'An unexpected error occurred while adding the client.';
          this.openAlertDialog('Error', errorMessage);
        }
      );
    } else {
      this.showSpinner = false;
      this.openAlertDialog('Error', 'Please fill all required fields.');
    }
  }
   // Utility function to format date as YYYY-MM-DD
   private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  redirect(){
    this.router.navigate([`/home/marketing/sla-generation`]);
  }
  
  // Open a popup dialog
  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message },
    });
  }
}
