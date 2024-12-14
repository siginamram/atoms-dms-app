import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketingService } from '../../services/marketing.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sla-generation-add',
  templateUrl: './sla-generation-add.component.html',
  styleUrls: ['./sla-generation-add.component.css'],
})
export class SlaGenerationAddComponent implements OnInit {
  slaForm: FormGroup;
  leadID: number | null = null; // Store the current LeadID

  constructor(
    private fb: FormBuilder,
    private commanApiService: MarketingService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog // Correctly initialized MatDialog
  ) {
    // Initialize the form with required validators
    this.slaForm = this.fb.group({
      leadName: ['', Validators.required],
      organizationDomain: ['', Validators.required],
      clientName: ['', Validators.required],
      designation: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      posterDesigns: ['', Validators.required],
      youtubeVideos: ['', Validators.required],
      reels: ['', Validators.required],
      addBudget: ['', Validators.required],
      shootOffer: ['', Validators.required],
      shootBudget: [null],
      chargePerVisit: [''],
      basePackage: ['', Validators.required],
      facebook: [false],
      instagram: [false],
      linkedin: [false],
      youtube: [false],
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
    this.commanApiService.getClientByLeadId(leadID).subscribe(
      (data: any) => {
        console.log('Client Details:', data);

        // Bind API data to the form
        this.slaForm.patchValue({
          leadName: data.organizationName || '',
          organizationDomain: data.domain || '',
          clientName: data.clientName || '',
          designation: data.clientDesignation || '',
          city: data.cityID || '',
          address: data.address || '',
          posterDesigns: data.package?.noOfPosters || '',
          youtubeVideos: data.package?.noOfYouTubeVideos || '',
          reels: data.package?.noOfReels || '',
          addBudget: data.package?.adBudget || '',
          shootOffer:  data.package?.shootOffered === true || data.package?.shootOffered === 1 ? 1 : 0,
          shootBudget:  data.package?.shootBudget === true || data.package?.shootBudget === 1 ? 1 : 0,
          chargePerVisit: data.package?.chargePerVisit || '',
          basePackage: data.package?.basePackage || '',
          facebook: data.package?.smFaceBook || false,
          instagram: data.package?.smInstagram || false,
          linkedin: data.package?.smLinkedin || false,
          youtube: data.package?.smYoutube || false,
          others: data.package?.smOthers || false,
          otherPlatforms: data.package?.smOthersText || '',
        });
      },
      (error) => {
        console.error('Failed to fetch client details:', error);
      }
    );
  }

  // Handle form submission
  onSubmit(): void {
    if (this.slaForm.valid) {
      const formData = this.slaForm.value;
  
      const payload = {
        //clientID: 0,
        clientName: formData.clientName,
        clientDesignation: formData.designation,
        organizationName: formData.leadName,
        address: formData.address,
        domain: formData.organizationDomain,
        clientCategory: 1,
        cityID: parseInt(formData.city, 10),
        leadID: this.leadID || 0,
        createdBy: parseInt(localStorage.getItem('UserID') || '0', 10),
        //onboardedOn: new Date().toISOString(),
        //serviceStartDate: new Date().toISOString().split('T')[0],
        //isKTCompleted: false,
        //ktDate: new Date().toISOString().split('T')[0],
        //isAdvReceived: true,
        isActive: true,
        package: {
          //clientID: 0,
          basePackage: parseFloat(formData.basePackage),
          adBudget: parseFloat(formData.addBudget),
          noOfPosters: parseInt(formData.posterDesigns, 10),
          noOfReels: parseInt(formData.reels, 10),
          noOfYouTubeVideos: parseInt(formData.youtubeVideos, 10),
          shootOffered: this.slaForm.value.shootOffer === 1 ? true : false,
          shootBudget:this.slaForm.value.shootBudget === 1 ? true : false,
          chargePerVisit: parseFloat(formData.chargePerVisit),
          smFaceBook: this.slaForm.value.facebook,
          smInstagram: this.slaForm.value.instagram,
          smLinkedin: this.slaForm.value.linkedin,
          smYoutube: this.slaForm.value.youtube,
          smOthers: this.slaForm.value.others,
          smOthersText: this.slaForm.value.otherPlatforms || '',
          //slaCopy: '',
        },
        advancePaymentStatus: 1,
      };
  
      console.log('Payload:', payload);
  
      this.commanApiService.addClient(payload).subscribe(
        (response) => {
          this.openAlertDialog('Success', 'Client added successfully!');
        },
        (error) => {
          console.error('Error adding client:', error);
          this.openAlertDialog('Error', 'Failed to add client. Please try again.');
        }
      );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields.');
    }
  }
  
  // Open a popup dialog
  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message },
    });
  }
}
