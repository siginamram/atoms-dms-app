import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MarketingService } from '../../services/marketing.service';



@Component({
  selector: 'app-leadmanagementadd',
  standalone:false,
  templateUrl: './leadmanagementadd.component.html',
  styleUrls: ['./leadmanagementadd.component.css'],
})

export class LeadmanagementaddComponent implements OnInit {
  leadForm: FormGroup;
  countries: { id: number; name: string }[] = [];
  filteredStates: { id: number; name: string }[] = [];
  filteredDistricts: { id: number; name: string }[] = [];
  filteredCities: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commanApiService: MarketingService,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.leadForm = this.fb.group({
      organizationName: ['', [Validators.required, Validators.minLength(3)]],
      domain: ['', Validators.required],
      date: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      pocName: ['', Validators.required],
      pocContact: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      pocDesignation: ['', Validators.required],
      referredBy: [''],
      status: ['', Validators.required],
      insight: [''],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  // Load countries from the API
  loadCountries() {
    this.commanApiService.getAllCountries().subscribe(
      (data: any) => {
        this.countries = data.map((country: any) => ({
          id: country.countryID,
          name: country.countryName,
        }));
      },
      (error) => {
        this.openAlertDialog('Error', 'Failed to load countries. Please try again.', 'error');
      }
    );
  }

  // Handle country change and load states
  onCountryChange(countryId: number) {
    this.commanApiService.getStatesByCountry(countryId).subscribe(
      (data: any) => {
        this.filteredStates = data.map((state: any) => ({
          id: state.stateID,
          name: state.stateName,
        }));
        this.filteredDistricts = [];
        this.filteredCities = [];
        this.leadForm.patchValue({ state: '', district: '', city: '' });
      },
      (error) => {
        this.openAlertDialog('Error', 'Failed to load states. Please try again.', 'error');
      }
    );
  }

  // Handle state change and load districts
  onStateChange(stateId: number) {
    this.commanApiService.getDistrictsByState(stateId).subscribe(
      (data: any) => {
        this.filteredDistricts = data.map((district: any) => ({
          id: district.districtID,
          name: district.districtName,
        }));
        this.filteredCities = [];
        this.leadForm.patchValue({ district: '', city: '' });
      },
      (error) => {
        this.openAlertDialog('Error', 'Failed to load districts. Please try again.', 'error');
      }
    );
  }

  // Handle district change and load cities
  onDistrictChange(districtId: number) {
    this.commanApiService.getCitiesByDistrict(districtId).subscribe(
      (data: any) => {
        this.filteredCities = data.map((city: any) => ({
          id: city.cityID,
          name: city.cityName,
        }));
        this.leadForm.patchValue({ city: '' });
      },
      (error) => {
        this.openAlertDialog('Error', 'Failed to load cities. Please try again.', 'error');
      }
    );
  }

  onSubmit() {
    if (this.leadForm.valid) {
      const userID = parseInt(localStorage.getItem('UserID') || '0', 10);
  
      const payload = {
        OrganizationName: this.leadForm.get('organizationName')?.value,
        Domain: this.leadForm.get('domain')?.value,
        Date: this.formatDate(new Date(this.leadForm.get('date')?.value)),
        CityID: this.leadForm.get('city')?.value,
        Address: this.leadForm.get('address')?.value,
        ReferredBy: this.leadForm.get('referredBy')?.value,
        POCName: this.leadForm.get('pocName')?.value,
        POCContact: this.leadForm.get('pocContact')?.value,
        POCDesignation: this.leadForm.get('pocDesignation')?.value,
        Status: parseInt(this.leadForm.get('status')?.value, 10),
        Insight: this.leadForm.get('insight')?.value,
        SalesPersonID: userID,
      };
  
      // Call the API and handle plain text response
      this.commanApiService.addLead(payload).subscribe(
        (response: string) => {
          if (response === 'Success') {
            this.openAlertDialog('Success', 'Lead saved successfully!', 'success');
            this.router.navigate(['/home/marketing/lead-management']);
            this.leadForm.reset();
          } else {
            this.openAlertDialog('Error', 'Unexpected response from server.', 'error');
          }
        },
        (error) => {
          console.error('Error saving lead:', error);
          this.openAlertDialog('Error', `Failed to save lead. Please try again. \n ${error?.error}`,'error');
        }
      );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.', 'error');
    }
  }
    // Utility function to format date as YYYY-MM-DD
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

  // Open the alert dialog dynamically
  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type,
      },
    });
  }
}
